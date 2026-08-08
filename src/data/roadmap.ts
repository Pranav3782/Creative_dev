export interface Task {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
  effort?: 'short' | 'medium' | 'long';
  date?: string; // ISO date string without time (e.g., '2023-08-08')
  createdAt?: string; // ISO datetime string
  completedAt?: string; // ISO datetime string
  roadmapLevelId?: number;
  category?: string;
}

export interface Level {
  id: number;
  title: string;
  duration: string;
  description: string;
  tasks: Task[];
  project: string;
  icon: string; // lucide icon name or our custom type
  status: 'locked' | 'active' | 'completed';
}

export const roadmapData: Level[] = [
  {
    id: 0,
    title: "Prepare Base",
    duration: "1 WEEK",
    description: "Solidify your frontend foundation for creative coding.",
    project: "Animated Cursor & Particle Background",
    icon: "Rocket",
    status: "active",
    tasks: [
      { id: "0-1", title: "Modern JavaScript (ES6+)", completed: false, effort: "medium" },
      { id: "0-2", title: "requestAnimationFrame basics", completed: false, effort: "short" },
      { id: "0-3", title: "Canvas API Fundamentals", completed: false, effort: "long" },
      { id: "0-4", title: "Math for Motion (Trig, Vectors)", completed: false, effort: "long" },
    ]
  },
  {
    id: 1,
    title: "GSAP Mastery",
    duration: "2-3 WEEKS",
    description: "Master the industry-standard animation library.",
    project: "Apple-style Hero & Scroll Story Page",
    icon: "MousePointer2",
    status: "locked",
    tasks: [
      { id: "1-1", title: "Timelines & Tweens", completed: false, effort: "medium" },
      { id: "1-2", title: "ScrollTrigger fundamentals", completed: false, effort: "long" },
      { id: "1-3", title: "SplitText and Staggers", completed: false, effort: "medium" },
      { id: "1-4", title: "Flip & Observer plugins", completed: false, effort: "medium" },
    ]
  },
  {
    id: 2,
    title: "Advanced CSS",
    duration: "2 WEEKS",
    description: "Push CSS to its limits before reaching for WebGL.",
    project: "Animated Navigation & Landing",
    icon: "Code2",
    status: "locked",
    tasks: [
      { id: "2-1", title: "Clip-path and Masks", completed: false, effort: "short" },
      { id: "2-2", title: "Blend Modes & Filters", completed: false, effort: "short" },
      { id: "2-3", title: "SVG Animations", completed: false, effort: "medium" },
      { id: "2-4", title: "Advanced Layouts (Grid/Subgrid)", completed: false, effort: "medium" },
    ]
  },
  {
    id: 3,
    title: "Three.js Fundamentals",
    duration: "4-5 WEEKS",
    description: "Enter the world of 3D graphics in the browser.",
    project: "3D Room, Earth, Product Showcase",
    icon: "Box",
    status: "locked",
    tasks: [
      { id: "3-1", title: "Scene, Camera, Renderer", completed: false, effort: "medium" },
      { id: "3-2", title: "Geometry & Materials", completed: false, effort: "long" },
      { id: "3-3", title: "Lighting & Shadows", completed: false, effort: "medium" },
      { id: "3-4", title: "Textures & Controls", completed: false, effort: "medium" },
      { id: "3-5", title: "Animation Loop & Performance", completed: false, effort: "long" },
    ]
  },
  {
    id: 4,
    title: "React Three Fiber",
    duration: "3 WEEKS",
    description: "Declarative 3D within the React ecosystem.",
    project: "Interactive 3D Product Viewer",
    icon: "Atom",
    status: "locked",
    tasks: [
      { id: "4-1", title: "Canvas & useFrame", completed: false, effort: "short" },
      { id: "4-2", title: "Drei (Helpers, Controls)", completed: false, effort: "medium" },
      { id: "4-3", title: "Loading 3D Models (GLTF)", completed: false, effort: "long" },
      { id: "4-4", title: "Camera & Scene Animation", completed: false, effort: "long" },
    ]
  },
  {
    id: 5,
    title: "Post Processing & Effects",
    duration: "4 WEEKS",
    description: "Add that cinematic polish to your scenes.",
    project: "Cinematic 3D Landing Page",
    icon: "Wand2",
    status: "locked",
    tasks: [
      { id: "5-1", title: "Bloom, DOF, Motion Blur", completed: false, effort: "medium" },
      { id: "5-2", title: "Noise, Glitch, Vignette", completed: false, effort: "short" },
      { id: "5-3", title: "Environment & Fog", completed: false, effort: "short" },
      { id: "5-4", title: "Custom Effects Setup", completed: false, effort: "long" },
    ]
  },
  {
    id: 6,
    title: "Shaders (GLSL)",
    duration: "5 WEEKS",
    description: "Unlock the true power of the GPU.",
    project: "Animated Shader Background & Effects",
    icon: "Sparkles",
    status: "locked",
    tasks: [
      { id: "6-1", title: "GLSL Basics & Syntax", completed: false, effort: "long" },
      { id: "6-2", title: "Vertex & Fragment Shaders", completed: false, effort: "long" },
      { id: "6-3", title: "Noise, Distortion, Waves", completed: false, effort: "long" },
      { id: "6-4", title: "Fire, Water, Morphing", completed: false, effort: "long" },
    ]
  },
  {
    id: 7,
    title: "Blender Essentials",
    duration: "3 WEEKS",
    description: "Create your own 3D assets.",
    project: "Create & Export Custom 3D Model",
    icon: "Cuboid",
    status: "locked",
    tasks: [
      { id: "7-1", title: "Basic Modeling", completed: false, effort: "medium" },
      { id: "7-2", title: "Materials & Lighting", completed: false, effort: "medium" },
      { id: "7-3", title: "Simple Animation", completed: false, effort: "medium" },
      { id: "7-4", title: "Export GLB/GLTF pipeline", completed: false, effort: "short" },
    ]
  },
  {
    id: 8,
    title: "Rebuild Award Websites",
    duration: "6-8 WEEKS",
    description: "Learn from the best by recreating their work.",
    project: "Clone Apple / Nike / Award-winning Sites",
    icon: "Monitor",
    status: "locked",
    tasks: [
      { id: "8-1", title: "Study Interactions", completed: false, effort: "short" },
      { id: "8-2", title: "Recreate Animations", completed: false, effort: "long" },
      { id: "8-3", title: "Smooth Scroll Experiences", completed: false, effort: "medium" },
      { id: "8-4", title: "3D & Storytelling Integration", completed: false, effort: "long" },
    ]
  },
  {
    id: 9,
    title: "Signature Portfolio",
    duration: "ONGOING",
    description: "Build your masterpiece to get hired.",
    project: "Stand Out. Get Hired.",
    icon: "Flag",
    status: "locked",
    tasks: [
      { id: "9-1", title: "Unique Interactions Design", completed: false, effort: "long" },
      { id: "9-2", title: "Performance Optimization", completed: false, effort: "medium" },
      { id: "9-3", title: "Mobile Responsiveness (3D)", completed: false, effort: "long" },
      { id: "9-4", title: "Deploy & Share", completed: false, effort: "short" },
    ]
  }
];
