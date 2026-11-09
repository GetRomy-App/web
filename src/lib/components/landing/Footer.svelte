<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from '$lib/gsap';

	let { footerText = $bindable<HTMLElement>() } = $props();
	let container: HTMLDivElement;

	const THEMES = [
		{ c1: '#000000', c2: '#0048ff', c3: '#0088ff', c4: '#ffffff' },
		{ c1: '#0f002b', c2: '#4a00e0', c3: '#d9005a', c4: '#ff80bf' },
		{ c1: '#000000', c2: '#0b132b', c3: '#1c2541', c4: '#5bc0be' },
		{ c1: '#26001b', c2: '#bd0034', c3: '#ff5e00', c4: '#ffcc00' },
		{ c1: '#001a09', c2: '#006633', c3: '#00cc66', c4: '#ccffdd' },
		{ c1: '#12003b', c2: '#b100e8', c3: '#ff007c', c4: '#00ffff' },
		{ c1: '#1f1300', c2: '#8c5900', c3: '#d9a300', c4: '#fff1b8' },
		{ c1: '#2e0014', c2: '#b80052', c3: '#ff66a3', c4: '#ffe6f0' },
		{ c1: '#1a0000', c2: '#8a0a00', c3: '#ff4d00', c4: '#ffea00' },
		{ c1: '#000a14', c2: '#00594d', c3: '#00ff88', c4: '#aaffff' },
		{ c1: '#10001a', c2: '#4e008e', c3: '#9933ff', c4: '#e6ccff' },
		{ c1: '#000f1a', c2: '#004d66', c3: '#00b3b3', c4: '#ffe6f2' },
		{ c1: '#260d00', c2: '#8c3a00', c3: '#d96600', c4: '#ffb366' }
	];

	const vertexShader = `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;

	const fragmentShader = `
		varying vec2 vUv;
		uniform float uTime;
		uniform vec2 uResolution;
		uniform vec3 uColor1;
		uniform vec3 uColor2;
		uniform vec3 uColor3;
		uniform vec3 uColor4;
		uniform vec3 uLightPos;
		uniform float uDepth;
		uniform float uSpeed;
		uniform float uNoiseScale;
		uniform float uWarpAmount;
		uniform float uFoldFrequency;
		uniform float uAngle;
		uniform float uConnections;
		uniform float uShadowWidth;

		vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
		vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
		vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
		vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

		float snoise(vec3 v) {
			const vec2 C = vec2(1.0/6.0, 1.0/3.0);
			const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
			vec3 i = floor(v + dot(v, C.yyy));
			vec3 x0 = v - i + dot(i, C.xxx);
			vec3 g = step(x0.yzx, x0.xyz);
			vec3 l = 1.0 - g;
			vec3 i1 = min(g.xyz, l.zxy);
			vec3 i2 = max(g.xyz, l.zxy);
			vec3 x1 = x0 - i1 + C.xxx;
			vec3 x2 = x0 - i2 + C.yyy;
			vec3 x3 = x0 - D.yyy;
			i = mod289(i);
			vec4 p = permute(permute(permute(
				i.z + vec4(0.0, i1.z, i2.z, 1.0))
				+ i.y + vec4(0.0, i1.y, i2.y, 1.0))
				+ i.x + vec4(0.0, i1.x, i2.x, 1.0));
			float n_ = 0.142857142857;
			vec3 ns = n_ * D.wyz - D.xzx;
			vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
			vec4 x_ = floor(j * ns.z);
			vec4 y_ = floor(j - 7.0 * x_);
			vec4 x = x_ * ns.x + ns.yyyy;
			vec4 y = y_ * ns.x + ns.yyyy;
			vec4 h = 1.0 - abs(x) - abs(y);
			vec4 b0 = vec4(x.xy, y.xy);
			vec4 b1 = vec4(x.zw, y.zw);
			vec4 s0 = floor(b0)*2.0 + 1.0;
			vec4 s1 = floor(b1)*2.0 + 1.0;
			vec4 sh = -step(h, vec4(0.0));
			vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
			vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
			vec3 p0 = vec3(a0.xy, h.x);
			vec3 p1 = vec3(a0.zw, h.y);
			vec3 p2 = vec3(a1.xy, h.z);
			vec3 p3 = vec3(a1.zw, h.w);
			vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
			p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
			vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
			m = m * m;
			return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
		}

		float getSurface(vec2 p) {
			float c = cos(uAngle), s = sin(uAngle);
			mat2 rot = mat2(c, -s, s, c);
			vec2 rp = rot * p;
			float n1 = snoise(vec3(rp * uNoiseScale * 0.25, uTime * uSpeed * 0.7));
			float n2 = snoise(vec3(rp * uNoiseScale * 0.25 + vec2(21.4, 15.2), uTime * uSpeed * 0.9));
			float trig1 = sin(rp.x * uNoiseScale * 0.5 + uTime * uSpeed) * 0.3;
			float trig2 = cos(rp.y * uNoiseScale * 0.5 - uTime * uSpeed) * 0.3;
			vec2 flow = vec2(n1 + trig1, n2 + trig2);
			vec2 wp = rp + flow * (uWarpAmount * 0.12);
			float freq = uFoldFrequency * 0.5;
			float phase = sin(wp.y * freq + flow.y * 2.0) * uConnections;
			float mainWave = sin(wp.x * freq + phase * uWarpAmount * 0.3);
			float n3 = snoise(vec3(wp * 0.5, uTime * uSpeed * 0.5));
			return (mainWave * 0.85 + n3 * 0.15) * 0.5;
		}

		void main() {
			vec2 uv = gl_FragCoord.xy / uResolution.xy;
			vec2 p = uv * 2.0 - 1.0;
			p.x *= uResolution.x / uResolution.y;
			vec2 e = vec2(0.09, 0.0);
			float dx = (getSurface(p + e.xy) - getSurface(p - e.xy)) / (2.0 * e.x);
			float dy = (getSurface(p + e.yx) - getSurface(p - e.yx)) / (2.0 * e.x);
			float safeDepth = max(uDepth, 0.02);
			vec3 normal = normalize(vec3(-dx, -dy, safeDepth));
			vec3 lightDir = normalize(uLightPos);
			float diffuse = dot(normal, lightDir) * 0.5 + 0.5;
			float t = diffuse;
			t += getSurface(p) * 0.04;
			t = clamp(t, 0.0, 1.0);
			t = t * t * (3.0 - 2.0 * t);
			vec3 color = mix(uColor1, uColor2, smoothstep(0.0, uShadowWidth + 0.15, t));
			color = mix(color, uColor3, smoothstep(uShadowWidth + 0.05, 0.65, t));
			color = mix(color, uColor4, smoothstep(0.55, 1.05, t));
			float grain = fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453);
			color += (grain - 0.5) * 0.03;
			gl_FragColor = vec4(color, 1.0);
		}
	`;

	let materialRef: any = null;
	let lastThemeIndex = -1;

	function pickRandomTheme() {
		let idx;
		do {
			idx = Math.floor(Math.random() * THEMES.length);
		} while (idx === lastThemeIndex);
		lastThemeIndex = idx;
		return THEMES[idx];
	}

	function transitionToTheme(theme: typeof THEMES[0]) {
		if (!materialRef) return;

		import('three').then((THREE) => {
			const proxy = {
				r1: materialRef.uniforms.uColor1.value.r,
				g1: materialRef.uniforms.uColor1.value.g,
				b1: materialRef.uniforms.uColor1.value.b,
				r2: materialRef.uniforms.uColor2.value.r,
				g2: materialRef.uniforms.uColor2.value.g,
				b2: materialRef.uniforms.uColor2.value.b,
				r3: materialRef.uniforms.uColor3.value.r,
				g3: materialRef.uniforms.uColor3.value.g,
				b3: materialRef.uniforms.uColor3.value.b,
				r4: materialRef.uniforms.uColor4.value.r,
				g4: materialRef.uniforms.uColor4.value.g,
				b4: materialRef.uniforms.uColor4.value.b
			};

			const t1 = new THREE.Color(theme.c1);
			const t2 = new THREE.Color(theme.c2);
			const t3 = new THREE.Color(theme.c3);
			const t4 = new THREE.Color(theme.c4);

			gsap.to(proxy, {
				r1: t1.r, g1: t1.g, b1: t1.b,
				r2: t2.r, g2: t2.g, b2: t2.b,
				r3: t3.r, g3: t3.g, b3: t3.b,
				r4: t4.r, g4: t4.g, b4: t4.b,
				duration: 1.2,
				ease: 'power2.inOut',
				onUpdate: () => {
					materialRef.uniforms.uColor1.value.setRGB(proxy.r1, proxy.g1, proxy.b1);
					materialRef.uniforms.uColor2.value.setRGB(proxy.r2, proxy.g2, proxy.b2);
					materialRef.uniforms.uColor3.value.setRGB(proxy.r3, proxy.g3, proxy.b3);
					materialRef.uniforms.uColor4.value.setRGB(proxy.r4, proxy.g4, proxy.b4);
				}
			});
		});
	}

	onMount(() => {
		let animationId: number;
		let observer: ResizeObserver;
		let renderer: any;

		const init = async () => {
			const THREE = await import('three');

			const scene = new THREE.Scene();
			const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
			camera.position.z = 1;

			renderer = new THREE.WebGLRenderer({ antialias: true });
			const rect = container.getBoundingClientRect();
			renderer.setSize(rect.width, rect.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			container.appendChild(renderer.domElement);

			const theme = pickRandomTheme();

			const material = new THREE.ShaderMaterial({
				vertexShader,
				fragmentShader,
				uniforms: {
					uTime: { value: 0 },
					uResolution: { value: new THREE.Vector2(rect.width, rect.height) },
					uColor1: { value: new THREE.Color(theme.c1) },
					uColor2: { value: new THREE.Color(theme.c2) },
					uColor3: { value: new THREE.Color(theme.c3) },
					uColor4: { value: new THREE.Color(theme.c4) },
					uDepth: { value: 0.04 },
					uLightPos: { value: new THREE.Vector3(0.968, -0.36, 1.0) },
					uSpeed: { value: 0.1148 },
					uNoiseScale: { value: 0.714 },
					uWarpAmount: { value: 4.0 },
					uFoldFrequency: { value: 1.865 },
					uAngle: { value: 1.08699 },
					uConnections: { value: 0.8715 },
					uShadowWidth: { value: 0.01 }
				}
			});
			materialRef = material;

			const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
			scene.add(mesh);

			const clock = new THREE.Clock();

			function animate() {
				animationId = requestAnimationFrame(animate);
				material.uniforms.uTime.value = clock.getElapsedTime();
				renderer.render(scene, camera);
			}
			animate();

			observer = new ResizeObserver((entries) => {
				for (const entry of entries) {
					const { width, height } = entry.contentRect;
					renderer.setSize(width, height);
					material.uniforms.uResolution.value.set(width, height);
				}
			});
			observer.observe(container);

			// Pick a new random theme each time the footer scrolls into view
			const io = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							transitionToTheme(pickRandomTheme());
						}
					}
				},
				{ threshold: 0.1 }
			);
			io.observe(container.closest('footer')!);
		};

		init();

		return () => {
			if (animationId) cancelAnimationFrame(animationId);
			if (observer) observer.disconnect();
			if (renderer) {
				renderer.dispose();
				if (container?.contains(renderer.domElement)) {
					container.removeChild(renderer.domElement);
				}
			}
			if (materialRef) materialRef.dispose();
		};
	});
</script>

<footer class="footer-reveal">
	<div bind:this={container} class="absolute inset-0 z-0"></div>
	<div bind:this={footerText} class="relative z-10"></div>
</footer>

<style>
	.footer-reveal {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 280px;
		z-index: 0;
		overflow: hidden;
	}
</style>
