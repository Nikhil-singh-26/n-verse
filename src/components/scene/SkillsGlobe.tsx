'use client';

import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { Html } from '@react-three/drei';
import { X, CheckCircle2, Sparkles } from 'lucide-react';

export interface TechItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  color: string;
  drawType: string;
}

// User-specified exact skills suite (29 official skills only, repeated across the globe)
export const TECH_DATABASE: TechItem[] = [
  // Programming Languages
  { id: 'java', name: 'Java', category: 'Language', icon: 'java', description: 'Core OOP, multi-threaded systems, collections framework, and robust backend logic.', color: '#ea580c', drawType: 'java' },
  { id: 'javascript', name: 'JavaScript', category: 'Language', icon: 'javascript', description: 'ES6+ modern runtime, asynchronous event loops, closures, and full-stack web architecture.', color: '#f7df1e', drawType: 'js' },
  { id: 'typescript', name: 'TypeScript', category: 'Language', icon: 'typescript', description: 'Type-safe full-stack application development, interfaces, generics, and enterprise architecture.', color: '#3178c6', drawType: 'ts' },
  { id: 'c', name: 'C Language', category: 'Language', icon: 'c', description: 'Low-level systems programming, pointer arithmetic, memory management, and data structures.', color: '#64748b', drawType: 'c' },
  { id: 'dart', name: 'Dart', category: 'Language / Mobile', icon: 'dart', description: 'Client-optimized object-oriented language engineered for cross-platform Flutter applications.', color: '#0175c2', drawType: 'dart' },

  // Frontend & Styling
  { id: 'html5', name: 'HTML5', category: 'Frontend', icon: 'html5', description: 'Semantic structure, accessible markup, Canvas API, and modern web specifications.', color: '#e44d26', drawType: 'html5' },
  { id: 'css3', name: 'CSS3', category: 'Frontend', icon: 'css3', description: 'Modern CSS Grid, Flexbox, responsive layouts, media queries, and keyframe animations.', color: '#264de4', drawType: 'css3' },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'Styling', icon: 'tailwindcss', description: 'Utility-first styling workflow, responsive design tokens, and modular UI component composition.', color: '#38bdf8', drawType: 'tailwind' },
  { id: 'bootstrap', name: 'Bootstrap', category: 'Styling', icon: 'bootstrap', description: 'Responsive 12-column grid system, utility classes, and rapid interface scaffolding.', color: '#7952b3', drawType: 'bootstrap' },
  { id: 'react', name: 'React.js', category: 'Frontend', icon: 'react', description: 'Component-driven reactive UI architecture, custom hooks, Virtual DOM, and state reconciliation.', color: '#00d8ff', drawType: 'react' },
  { id: 'nextjs', name: 'Next.js', category: 'Full-Stack', icon: 'nextjs', description: 'React framework with App Router, Server Components, SSR, SSG, and edge routing.', color: '#ffffff', drawType: 'nextjs' },

  // 3D & Animation
  { id: 'gsap', name: 'GSAP', category: '3D & Motion', icon: 'gsap', description: 'GreenSock Animation Platform, ScrollTrigger timelines, and high-performance choreographed tweens.', color: '#88ce02', drawType: 'gsap' },
  { id: 'threejs', name: 'Three.js', category: '3D & Motion', icon: 'threejs', description: 'WebGL scene graph, lighting models, procedural geometries, PBR materials, and camera math.', color: '#ffffff', drawType: 'threejs' },
  { id: 'r3f', name: 'React Three Fiber', category: '3D & Motion', icon: 'r3f', description: 'Declarative Three.js component architecture for React with reactive frame lifecycle loops.', color: '#ffffff', drawType: 'r3f' },
  { id: 'drei', name: 'Drei', category: '3D & Motion', icon: 'drei', description: 'Curated library of high-performance Three.js helpers, 3D HTML portals, and camera controls.', color: '#ef4444', drawType: 'drei' },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'Backend', icon: 'nodejs', description: 'Event-driven asynchronous I/O server runtime powering high-throughput backend services.', color: '#539e43', drawType: 'node' },
  { id: 'express', name: 'Express.js', category: 'Backend', icon: 'express', description: 'Fast, minimalist web framework for Node.js RESTful APIs, routing, and middleware.', color: '#ffffff', drawType: 'express' },

  // Databases & ORMs
  { id: 'mongodb', name: 'MongoDB', category: 'Database', icon: 'mongodb', description: 'NoSQL document persistence, JSON-like flexible schemas, and aggregation pipelines.', color: '#47a248', drawType: 'mongodb' },
  { id: 'mongoose', name: 'Mongoose', category: 'Database / ORM', icon: 'mongoose', description: 'Elegant MongoDB object modeling, schema validation, middleware hooks, and business logic.', color: '#e11d48', drawType: 'mongoose' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database', icon: 'postgresql', description: 'Advanced open-source relational database with ACID compliance, schemas, and complex SQL.', color: '#336791', drawType: 'postgres' },

  // Mobile
  { id: 'flutter', name: 'Flutter', category: 'Mobile', icon: 'flutter', description: 'Google UI toolkit for crafting natively compiled mobile applications for iOS & Android.', color: '#02569b', drawType: 'flutter' },

  // Cloud & Hosting
  { id: 'firebase', name: 'Firebase', category: 'Cloud & Hosting', icon: 'firebase', description: 'Google cloud platform suite for realtime databases, authentication, and serverless hosting.', color: '#ffca28', drawType: 'firebase' },
  { id: 'vercel', name: 'Vercel', category: 'Cloud & Hosting', icon: 'vercel', description: 'Global edge deployment platform optimized for Next.js, automated preview CI/CD, and serverless functions.', color: '#ffffff', drawType: 'vercel' },
  { id: 'render', name: 'Render', category: 'Cloud & Hosting', icon: 'render', description: 'Unified cloud platform for building and running web applications, background workers, and PostgreSQL.', color: '#46e3b7', drawType: 'render' },

  // Tools & Workflow
  { id: 'git', name: 'Git', category: 'Tools', icon: 'git', description: 'Distributed version control system, branch management, rebasing, and merge workflows.', color: '#f05032', drawType: 'git' },
  { id: 'github', name: 'GitHub', category: 'Tools', icon: 'github', description: 'Source code collaboration, pull requests, automated GitHub Actions CI/CD, and release tracking.', color: '#ffffff', drawType: 'github' },
  { id: 'vscode', name: 'VS Code', category: 'Tools', icon: 'vscode', description: 'Primary developer IDE, integrated debugging pipelines, extensions, and workspace configurations.', color: '#0066b8', drawType: 'vscode' },
  { id: 'androidstudio', name: 'Android Studio', category: 'Tools', icon: 'androidstudio', description: 'Official IDE for Android development, Flutter SDK integration, emulators, and device profiling.', color: '#3ddc84', drawType: 'androidstudio' },
  { id: 'postman', name: 'Postman', category: 'Tools', icon: 'postman', description: 'API contract testing, automated test collections, environment variables, and endpoint validation.', color: '#ff6c37', drawType: 'postman' }
];

const NUM_ROWS = 12; // Latitude bands
const NUM_COLS = 24; // Longitude segments

// Map grid coordinates (row, col) to a technology item from the 29 user-requested skills
function getTechForCell(row: number, col: number): TechItem {
  // Deterministic repeating pattern across the 288 spherical cells
  const index = (row * 7 + col * 3 + Math.floor(row / 2)) % TECH_DATABASE.length;
  return TECH_DATABASE[index];
}

// Vector drawing routines for all 29 official skills
function renderLogoIcon(ctx: CanvasRenderingContext2D, type: string, size: number) {
  const r = size / 2;

  switch (type) {
    case 'java': {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.fillStyle = '#5382a1';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.2, r * 0.42, r * 0.22, 0, 0, Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-r * 0.16, -r * 0.52);
      ctx.quadraticCurveTo(0, -r * 0.32, -r * 0.08, -r * 0.12);
      ctx.moveTo(r * 0.12, -r * 0.6);
      ctx.quadraticCurveTo(r * 0.26, -r * 0.36, r * 0.14, -r * 0.12);
      ctx.stroke();
      break;
    }

    case 'js': {
      ctx.fillStyle = '#f7df1e';
      drawRoundedRect(ctx, -r * 0.8, -r * 0.8, r * 1.6, r * 1.6, r * 0.2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = `900 ${Math.round(size * 0.46)}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('JS', r * 0.68, r * 0.72);
      break;
    }

    case 'ts': {
      ctx.fillStyle = '#3178c6';
      drawRoundedRect(ctx, -r * 0.8, -r * 0.8, r * 1.6, r * 1.6, r * 0.2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.round(size * 0.46)}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('TS', r * 0.68, r * 0.72);
      break;
    }

    case 'c': {
      ctx.fillStyle = '#659ad2';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.round(size * 0.56)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('C', 0, 0);
      break;
    }

    case 'dart': {
      ctx.fillStyle = '#0175c2';
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, -r * 0.7);
      ctx.lineTo(r * 0.6, -r * 0.7);
      ctx.lineTo(0, r * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#00b4ab';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.7);
      ctx.lineTo(r * 0.6, -r * 0.7);
      ctx.lineTo(0, r * 0.7);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'html5': {
      ctx.fillStyle = '#e44d26';
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.8);
      ctx.lineTo(r * 0.7, -r * 0.8);
      ctx.lineTo(r * 0.56, r * 0.58);
      ctx.lineTo(0, r * 0.88);
      ctx.lineTo(-r * 0.56, r * 0.58);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f16529';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.7);
      ctx.lineTo(r * 0.58, -r * 0.7);
      ctx.lineTo(r * 0.46, r * 0.48);
      ctx.lineTo(0, r * 0.76);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.round(size * 0.48)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('5', 0, r * 0.05);
      break;
    }

    case 'css3': {
      ctx.fillStyle = '#264de4';
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.8);
      ctx.lineTo(r * 0.7, -r * 0.8);
      ctx.lineTo(r * 0.56, r * 0.58);
      ctx.lineTo(0, r * 0.88);
      ctx.lineTo(-r * 0.56, r * 0.58);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#2965f1';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.7);
      ctx.lineTo(r * 0.58, -r * 0.7);
      ctx.lineTo(r * 0.46, r * 0.48);
      ctx.lineTo(0, r * 0.76);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.round(size * 0.48)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('3', 0, r * 0.05);
      break;
    }

    case 'tailwind': {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold ${Math.round(size * 0.38)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TW', 0, 0);
      break;
    }

    case 'bootstrap': {
      ctx.fillStyle = '#7952b3';
      drawRoundedRect(ctx, -r * 0.8, -r * 0.8, r * 1.6, r * 1.6, r * 0.25);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.round(size * 0.54)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('B', 0, 0);
      break;
    }

    case 'react': {
      ctx.fillStyle = '#20232a';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#00d8ff';
      ctx.lineWidth = 2.0;
      for (let angle = 0; angle < Math.PI; angle += Math.PI / 3) {
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.72, r * 0.26, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#00d8ff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'nextjs': {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.round(size * 0.55)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', 0, 0);
      break;
    }

    case 'gsap': {
      ctx.fillStyle = '#0a0e17';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#88ce02';
      ctx.font = `900 ${Math.round(size * 0.32)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GSAP', 0, 0);
      break;
    }

    case 'threejs': {
      ctx.fillStyle = '#05070a';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.65);
      ctx.lineTo(r * 0.65, r * 0.45);
      ctx.lineTo(-r * 0.65, r * 0.45);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'r3f': {
      ctx.fillStyle = '#0a0f1d';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold ${Math.round(size * 0.32)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('R3F', 0, 0);
      break;
    }

    case 'drei': {
      ctx.fillStyle = '#ef4444';
      drawRoundedRect(ctx, -r * 0.8, -r * 0.8, r * 1.6, r * 1.6, r * 0.25);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.round(size * 0.32)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DREI', 0, 0);
      break;
    }

    case 'node': {
      ctx.fillStyle = '#333333';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const x = Math.cos(a) * r * 0.85;
        const y = Math.sin(a) * r * 0.85;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#539e43';
      ctx.font = `bold ${Math.round(size * 0.32)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('node', 0, 0);
      break;
    }

    case 'express': {
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.round(size * 0.44)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ex', 0, 0);
      break;
    }

    case 'mongodb': {
      ctx.fillStyle = '#13aa52';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.85);
      ctx.quadraticCurveTo(r * 0.75, 0, 0, r * 0.85);
      ctx.quadraticCurveTo(-r * 0.75, 0, 0, -r * 0.85);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.85);
      ctx.lineTo(0, r * 0.85);
      ctx.stroke();
      break;
    }

    case 'mongoose': {
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.36)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MG', 0, 0);
      break;
    }

    case 'postgres': {
      ctx.fillStyle = '#336791';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.round(size * 0.38)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SQL', 0, 0);
      break;
    }

    case 'flutter': {
      ctx.fillStyle = '#02569b';
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, -r * 0.7);
      ctx.lineTo(r * 0.7, -r * 0.7);
      ctx.lineTo(-r * 0.2, 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#0175c2';
      ctx.beginPath();
      ctx.moveTo(-r * 0.2, 0.2);
      ctx.lineTo(r * 0.35, 0.75);
      ctx.lineTo(r * 0.7, 0.75);
      ctx.lineTo(r * 0.15, 0.2);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'firebase': {
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffca28';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.7);
      ctx.lineTo(r * 0.5, r * 0.6);
      ctx.lineTo(-r * 0.5, r * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f57c00';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.3);
      ctx.lineTo(r * 0.45, r * 0.6);
      ctx.lineTo(-r * 0.2, r * 0.6);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'vercel': {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.55);
      ctx.lineTo(r * 0.55, r * 0.45);
      ctx.lineTo(-r * 0.55, r * 0.45);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'render': {
      ctx.fillStyle = '#14b8a6';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.round(size * 0.52)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('R', 0, 0);
      break;
    }

    case 'git': {
      ctx.save();
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#f05032';
      drawRoundedRect(ctx, -r * 0.68, -r * 0.68, r * 1.36, r * 1.36, r * 0.2);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-r * 0.22, -r * 0.38);
      ctx.lineTo(r * 0.22, r * 0.22);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-r * 0.22, -r * 0.38, r * 0.16, 0, Math.PI * 2);
      ctx.arc(r * 0.22, r * 0.22, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'github': {
      ctx.fillStyle = '#181717';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.3)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GIT', 0, 0);
      break;
    }

    case 'vscode': {
      ctx.fillStyle = '#0066b8';
      drawRoundedRect(ctx, -r * 0.8, -r * 0.8, r * 1.6, r * 1.6, r * 0.22);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.34)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VS', 0, 0);
      break;
    }

    case 'androidstudio': {
      ctx.fillStyle = '#3ddc84';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.36)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AS', 0, 0);
      break;
    }

    case 'postman': {
      ctx.fillStyle = '#ff6c37';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.34)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PM', 0, 0);
      break;
    }

    default: {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.32)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(type.toUpperCase().slice(0, 3), 0, 0);
      break;
    }
  }
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function SkillsGlobe() {
  const { activeSection, isReducedMotion } = useExperience();
  const isSkills = activeSection === 'skills';

  const globeSpinRef = useRef<THREE.Group>(null);
  const [activeTech, setActiveTech] = useState<TechItem | null>(null);

  const isDragging = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef(0);
  const currentRotation = useRef(0.85);

  // Radius of the planet globe (1.30m radius = 2.60m diameter)
  const radius = 1.30;

  // Dedicated procedural canvas texture with clean vector rendering for all 29 skills
  const [globeCanvasTexture, setGlobeCanvasTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const width = 2048;
    const height = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const drawGlobe = () => {
      // 1. Base Globe Surface: soft oceanic pale cyan
      ctx.fillStyle = '#cde7f6';
      ctx.fillRect(0, 0, width, height);

      const cellW = width / NUM_COLS;
      const cellH = height / NUM_ROWS;

      // 2. Draw Technology Logos centered in each grid cell
      for (let r = 0; r < NUM_ROWS; r++) {
        for (let c = 0; c < NUM_COLS; c++) {
          const tech = getTechForCell(r, c);
          const cx = c * cellW + cellW / 2;
          const cy = r * cellH + cellH / 2;
          const size = Math.min(cellW, cellH) * 0.54;

          // Glowing badge circular backing
          ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
          ctx.beginPath();
          ctx.arc(cx, cy - cellH * 0.08, size * 0.65, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.save();
          ctx.translate(cx, cy - cellH * 0.08);
          renderLogoIcon(ctx, tech.drawType, size);
          ctx.restore();

          // High-contrast legible skill name label under the icon
          ctx.fillStyle = '#0f172a';
          ctx.font = `bold ${Math.max(10, Math.round(cellH * 0.16))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(tech.name, cx, cy + cellH * 0.32);
        }
      }

      // 3. Coordinate Grid Lines (Parallels & Meridians)
      ctx.strokeStyle = '#273444';
      ctx.lineWidth = 1.8;

      for (let r = 0; r <= NUM_ROWS; r++) {
        const y = r * cellH;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (let c = 0; c <= NUM_COLS; c++) {
        const x = c * cellW;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // 4. Bolder Equator Line with division marks
      const equatorY = (NUM_ROWS / 2) * cellH;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(0, equatorY);
      ctx.lineTo(width, equatorY);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      for (let c = 0; c <= NUM_COLS * 2; c++) {
        const tx = (c * width) / (NUM_COLS * 2);
        ctx.fillRect(tx - 1, equatorY - 5, 2, 10);
      }

      texture.needsUpdate = true;
    };

    // Immediate synchronous draw - 100% clean, untainted WebGL texture
    drawGlobe();
    setGlobeCanvasTexture(texture);
  }, []);

  // Pointer drag interactions around the tilted polar axis
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDragging.current = true;
    previousPointer.current = { x: e.clientX, y: e.clientY };
    rotationVelocity.current = 0;
    if (typeof window !== 'undefined') {
      (window as unknown as { __isInteractingWithObject?: boolean }).__isInteractingWithObject = true;
    }
    if (e.target && 'setPointerCapture' in e.target) {
      // @ts-expect-error ThreeEvent target
      e.target.setPointerCapture?.(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    e.stopPropagation();

    const deltaX = e.clientX - previousPointer.current.x;
    previousPointer.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.0042;
    currentRotation.current += deltaX * sensitivity;
    rotationVelocity.current = deltaX * sensitivity;
  }, []);

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDragging.current = false;
    if (typeof window !== 'undefined') {
      (window as unknown as { __isInteractingWithObject?: boolean }).__isInteractingWithObject = false;
    }
  }, []);

  // Raycasting click to inspect clicked technology cell
  const handleGlobeClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!e.uv) return;

    // Map UV coordinates (0 to 1) to latitude row and longitude column
    const u = (e.uv.x + 1.0) % 1.0;
    const v = e.uv.y;

    const col = Math.floor(u * NUM_COLS) % NUM_COLS;
    const row = Math.min(NUM_ROWS - 1, Math.max(0, Math.floor((1 - v) * NUM_ROWS)));

    const clickedTech = getTechForCell(row, col);
    if (clickedTech) {
      setActiveTech(clickedTech);
    }
  }, []);

  useFrame((_, delta) => {
    if (!globeSpinRef.current) return;

    if (!isDragging.current) {
      if (!isReducedMotion) {
        currentRotation.current += delta * (isSkills ? 0.24 : 0.12);
      }
      currentRotation.current += rotationVelocity.current;
      rotationVelocity.current *= 0.94;
    }

    globeSpinRef.current.rotation.y = currentRotation.current;
  });

  // Earth axial tilt angle: ~23.44° = 0.409 rad
  const axialTilt = 0.409;

  return (
    <group position={[3.0, 0, 0.0]}>
      {/* Planetary Key Light illuminating the globe */}
      <spotLight
        position={[-1.2, 4.4, 1.8]}
        target-position={[0, 1.45, 0]}
        color="#fff7ee"
        intensity={3.6}
        angle={0.72}
        penumbra={0.6}
        castShadow
      />

      {/* Atmospheric Rim / Fill Light */}
      <pointLight position={[1.5, 2.0, 1.8]} color="#38bdf8" intensity={1.4} distance={6.0} />

      {/* ================= 1. PLANETARY FLOOR CONTACT SHADOW & ORBITAL AURA ================= */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <circleGeometry args={[1.35, 48]} />
        <meshBasicMaterial color="#080b12" transparent opacity={0.7} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[1.48, 1.54, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0]}>
        <ringGeometry args={[1.74, 1.76, 64]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.3} />
      </mesh>

      {/* ================= 2. PLANETARY TILTED AXIS ASSEMBLY ================= */}
      <group position={[0, 1.45, 0]} rotation={[0.08, 0, -axialTilt]}>
        {/* Freely Rotating Planetary Globe with Dense Technology Grid */}
        <group
          ref={globeSpinRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleGlobeClick}
        >
          {/* Main Spherical Globe Body */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[radius, 64, 64]} />
            {globeCanvasTexture ? (
              <meshStandardMaterial
                map={globeCanvasTexture}
                color="#ffffff"
                roughness={0.32}
                metalness={0.08}
              />
            ) : (
              <meshStandardMaterial color="#cde7f6" roughness={0.4} />
            )}
          </mesh>
        </group>

        {/* ================= COMPACT CONCISE TECHNOLOGY CALLOUT ================= */}
        {activeTech && (
          <Html
            position={[0, radius + 0.35, 0]}
            center
            distanceFactor={7.5}
            className="pointer-events-auto select-none z-30"
          >
            <div className="w-[300px] bg-[#0c121e]/98 border border-white/20 rounded-xl p-4 shadow-2xl text-white font-sans space-y-2.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <img
                      src={`/skills/${activeTech.icon}.svg`}
                      alt={activeTech.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white font-['Outfit'] truncate">{activeTech.name}</h4>
                    <span className="text-[10px] text-[#94a3b8] font-mono">
                      {activeTech.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTech(null)}
                  className="p-1 text-[#94a3b8] hover:text-white transition-colors"
                  aria-label="Close skill info"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {activeTech.description}
              </p>

              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Official Skill</span>
                </div>
                <span className="text-[#38bdf8]">N-VERSE Core</span>
              </div>
            </div>
          </Html>
        )}

      </group>
    </group>
  );
}
