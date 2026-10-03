import { useReducedMotion } from "motion/react";
import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * A dependency-free WebGL background. One fragment shader, many looks —
 * pick a `variant`, pass up to four `colors`, and tune `speed`.
 */
const MODES = {
  "mesh-gradient": 0,
  "static-mesh-gradient": 0,
  "grain-gradient": 1,
  warp: 2,
  water: 2,
  waves: 3,
  "color-panels": 3,
  voronoi: 4,
  swirl: 5,
  "dot-grid": 6,
  "dot-orbit": 6,
  "smoke-ring": 7,
  "pulsing-border": 7,
  "neuro-noise": 8,
  metaballs: 9,
  "god-rays": 10,
  spiral: 11,
  dithering: 12,
  "perlin-noise": 13,
  "simplex-noise": 13,
  "static-radial-gradient": 14,
} as const;

const STATIC_VARIANTS = new Set<ShaderBackgroundVariant>(["static-mesh-gradient", "static-radial-gradient"]);

export type ShaderBackgroundVariant = keyof typeof MODES;

export const SHADER_BACKGROUND_VARIANTS = Object.keys(MODES) as ShaderBackgroundVariant[];

export type ShaderBackgroundProps = {
  variant: ShaderBackgroundVariant;
  /** Up to four palette colours (hex). */
  colors?: string[];
  colorBack?: string;
  colorFront?: string;
  colorMid?: string;
  /** Animation speed multiplier. 0 freezes the frame. Default 0.4. */
  speed?: number;
  /** Scale of the pattern. Default 1. */
  scale?: number;
  className?: string;
  style?: CSSProperties;
} & Record<string, unknown>;

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `precision highp float;
uniform vec2 r;uniform float t;uniform int m;uniform float sc;
uniform vec3 c0;uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec3 cb;uniform vec3 cf;uniform vec3 cm;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 h2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
vec3 pal(float x){x=clamp(x,0.,1.)*3.;if(x<1.)return mix(c0,c1,x);if(x<2.)return mix(c1,c2,x-1.);return mix(c2,c3,x-2.);}
float bayer(vec2 p){p=mod(floor(p),4.);float x=p.x,y=p.y;
 float b=mod(x,2.)*2.+mod(y,2.)*3.-mod(x,2.)*mod(y,2.)*4.;float b2=floor(x/2.)*2.+floor(y/2.)*3.-floor(x/2.)*floor(y/2.)*4.;
 return (b*4.+b2+.5)/16.;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;float asp=r.x/r.y;vec2 q=(uv-.5)*vec2(asp,1.)/sc;vec3 col;
 if(m==0){
  vec2 w=q+.25*vec2(fbm(q*1.5+t*.2),fbm(q*1.5-t*.2))-.12;
  vec2 p0=.45*vec2(cos(t*.5),sin(t*.4));vec2 p1=.45*vec2(cos(t*.37+2.),sin(t*.53+1.));
  vec2 p2=.45*vec2(cos(t*.43+4.),sin(t*.31+3.));vec2 p3=.45*vec2(cos(t*.29+5.),sin(t*.47+5.));
  float w0=1./pow(length(w-p0)+.05,2.5),w1=1./pow(length(w-p1)+.05,2.5),w2=1./pow(length(w-p2)+.05,2.5),w3=1./pow(length(w-p3)+.05,2.5);
  col=(c0*w0+c1*w1+c2*w2+c3*w3)/(w0+w1+w2+w3);
 }else if(m==1){
  float f=fbm(q*1.2+vec2(t*.15,-t*.1));float g=smoothstep(.15,.85,f+.35*sin(q.y*2.+t*.4));
  col=mix(cb,pal(g),smoothstep(.1,.6,g+.2));col+=(h(gl_FragCoord.xy+fract(t))-.5)*.14;
 }else if(m==2){
  vec2 a=vec2(fbm(q*2.+t*.1),fbm(q*2.+vec2(5.2,1.3)-t*.1));vec2 b=vec2(fbm(q*2.+3.*a+vec2(1.7,9.2)+t*.15),fbm(q*2.+3.*a+vec2(8.3,2.8)));
  col=pal(fbm(q*2.+3.*b));
 }else if(m==3){
  float y=q.y*6.+sin(q.x*3.+t)*.8+fbm(q*2.+t*.2)*1.5;float s=smoothstep(.45,.55,abs(fract(y)-.5)*2.);
  col=mix(cb,cf,s);
 }else if(m==4){
  vec2 g=q*4.;vec2 i=floor(g),f=fract(g);float d=9.,d2=9.;vec2 id;
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 o=vec2(x,y);vec2 pt=h2(i+o);pt=.5+.4*sin(t+6.28*pt);float l=length(o+pt-f);if(l<d){d2=d;d=l;id=i+o;}else if(l<d2)d2=l;}
  col=pal(h(id));col*=.6+.4*smoothstep(0.,.08,d2-d);
 }else if(m==5){
  float rr=length(q),a=atan(q.y,q.x);float s=sin(a*3.+rr*10.-t*1.5+fbm(q*3.)*2.);
  col=mix(cb,pal(s*.5+.5),smoothstep(-.2,.6,s+.4-rr));
 }else if(m==6){
  vec2 g=q*18.;vec2 f=fract(g)-.5;float s=.12+.28*fbm(floor(g)*.15+t*.3);
  col=mix(cb,cf,smoothstep(s,s-.06,length(f)));
 }else if(m==7){
  float rr=length(q);float ring=abs(rr-.3-(fbm(q*3.+t*.3)-.5)*.25);
  col=cb+cf*(.012/(ring+.01))*(.6+.4*fbm(q*6.-t*.2));col=min(col,vec3(1.));
 }else if(m==8){
  vec2 p=q*3.;float s=0.;for(int i=0;i<6;i++){p=vec2(p.x*cos(.8)-p.y*sin(.8),p.x*sin(.8)+p.y*cos(.8))*1.25;s+=abs(sin(p.x+t*.6+sin(p.y*1.3+t*.3)))*0.18;}
  float v=pow(1.-clamp(s,0.,1.),3.);col=v<.5?mix(cb,cm,v*2.):mix(cm,cf,v*2.-1.);
 }else if(m==9){
  float f=0.;for(int i=0;i<6;i++){float fi=float(i);vec2 c=.35*vec2(sin(t*.7+fi*1.7),cos(t*.6+fi*2.3));f+=.03/dot(q-c,q-c);}
  float k=smoothstep(.9,1.1,f);col=mix(cb,pal(clamp(f*.25,0.,1.)),k);
 }else if(m==10){
  vec2 o=q-vec2(0.,.6);float a=atan(o.x,-o.y);float ray=fbm(vec2(a*6.,t*.3))*smoothstep(1.4,0.,length(o));
  col=mix(cb,mix(c1,c0,ray),clamp(ray*1.6,0.,1.));
 }else if(m==11){
  float rr=length(q),a=atan(q.y,q.x);float s=fract((log(rr+.001)*2.-a/6.283*3.)+t*.2);
  col=mix(cb,cf,smoothstep(.45,.5,s)-smoothstep(.95,1.,s));
 }else if(m==12){
  float f=fbm(q*2.+vec2(t*.2,0.))+.15*sin(t+q.x*2.);col=mix(cb,cf,step(bayer(gl_FragCoord.xy/2.),f*1.2-.2));
 }else if(m==13){
  float f=fbm(q*3.+t*.15);float l=abs(fract(f*8.)-.5);col=mix(cb,cf,smoothstep(.1,0.,l));
 }else{
  col=pal(length(q)*1.1);
 }
 gl_FragColor=vec4(col,1.);
}`;

function hex(c: string | undefined, fallback: [number, number, number]): [number, number, number] {
  if (!c) return fallback;
  const m = c.trim().replace("#", "");
  const full = m.length === 3 ? m.split("").map((x) => x + x).join("") : m.slice(0, 6);
  const v = Number.parseInt(full, 16);
  if (Number.isNaN(v)) return fallback;
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

export function ShaderBackground({
  variant,
  colors,
  colorBack,
  colorFront,
  colorMid,
  speed = 0.4,
  scale = 1,
  className,
  style,
}: ShaderBackgroundProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const frozen = reduce || speed === 0 || STATIC_VARIANTS.has(variant);
  const key = JSON.stringify([variant, colors, colorBack, colorFront, colorMid, speed, scale, frozen]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const list = colors?.length ? colors : ["#3b6bff", "#2e96ff", "#acb7ff", "#7372fe"];
    const pick = (i: number) => list[Math.min(i, list.length - 1)];
    const palette = [0, 1, 2, 3].map((i) => hex(pick(i), [0.5, 0.5, 0.5]));
    palette.forEach((c, i) => gl.uniform3fv(u(`c${i}`), c));
    gl.uniform3fv(u("cb"), hex(colorBack, hex(list[list.length - 1], [0, 0, 0])));
    gl.uniform3fv(u("cf"), hex(colorFront, palette[0]));
    gl.uniform3fv(u("cm"), hex(colorMid, palette[1]));
    gl.uniform1i(u("m"), MODES[variant] ?? 0);
    gl.uniform1f(u("sc"), scale);
    const uRes = u("r");
    const uTime = u("t");

    let raf = 0;
    let visible = true;
    const start = performance.now();
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    const draw = (now: number) => {
      resize();
      gl.uniform1f(uTime, frozen ? 12.0 : ((now - start) / 1000) * speed * 2.5 + 12.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      draw(now);
      if (!frozen && visible) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      if (frozen) draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !frozen) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <canvas ref={ref} aria-hidden="true" className={cn("block h-full w-full", className)} style={style} />;
}
