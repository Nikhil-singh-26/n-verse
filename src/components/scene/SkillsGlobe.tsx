'use client';

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { Html } from '@react-three/drei';
import { RotateCcw, X, CheckCircle2, Globe2 } from 'lucide-react';

interface TechItem {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  drawType: string;
}

// Full suite of authentic developer technologies present on the reference globe
const TECH_DATABASE: TechItem[] = [
  { id: 'html5', name: 'HTML5', category: 'Web Standards', description: 'Semantic structure, accessible markup, and modern web specifications.', color: '#e44d26', drawType: 'html5' },
  { id: 'css3', name: 'CSS3', category: 'Styling', description: 'Modern CSS Grid, Flexbox, keyframe animations, and responsive tokens.', color: '#264de4', drawType: 'css3' },
  { id: 'js', name: 'JavaScript', category: 'Language', description: 'ES6+ modern runtime, asynchronous event loops, and web architecture.', color: '#f7df1e', drawType: 'js' },
  { id: 'ts', name: 'TypeScript', category: 'Language', description: 'Type-safe full-stack application development and enterprise systems.', color: '#3178c6', drawType: 'ts' },
  { id: 'react', name: 'React', category: 'Frontend', description: 'Component-driven reactive UI architecture, hooks, and virtual DOM.', color: '#00d8ff', drawType: 'react' },
  { id: 'vue', name: 'Vue.js', category: 'Frontend', description: 'Progressive component framework with declarative reactivity.', color: '#42b883', drawType: 'vue' },
  { id: 'angular', name: 'Angular', category: 'Frontend', description: 'Enterprise TypeScript platform with modular dependency injection.', color: '#dd0031', drawType: 'angular' },
  { id: 'nodejs', name: 'Node.js', category: 'Backend Runtime', description: 'Event-driven asynchronous I/O server architecture and microservices.', color: '#539e43', drawType: 'node' },
  { id: 'python', name: 'Python', category: 'Language', description: 'Multi-paradigm language for backend services, automation, and AI.', color: '#3776ab', drawType: 'python' },
  { id: 'java', name: 'Java', category: 'Language', description: 'Core OOP, Data Structures, multi-threaded services, and JVM runtime.', color: '#ea580c', drawType: 'java' },
  { id: 'php', name: 'PHP', category: 'Backend', description: 'Server-side scripting engine powering web applications and CMSs.', color: '#777bb4', drawType: 'php' },
  { id: 'ruby', name: 'Ruby', category: 'Language', description: 'Elegant object-oriented language for rapid web application development.', color: '#cc342d', drawType: 'ruby' },
  { id: 'c', name: 'C Language', category: 'Systems', description: 'Low-level systems programming, pointers, and memory management.', color: '#475569', drawType: 'c' },
  { id: 'go', name: 'Go', category: 'Systems', description: 'High-concurrency systems language with lightweight goroutines.', color: '#00add8', drawType: 'go' },
  { id: 'dart', name: 'Dart', category: 'Mobile / Web', description: 'Client-optimized object-oriented language for cross-platform execution.', color: '#0175c2', drawType: 'dart' },
  { id: 'flutter', name: 'Flutter', category: 'Mobile Framework', description: 'Cross-platform native iOS & Android applications with custom widgets.', color: '#02569b', drawType: 'flutter' },
  { id: 'mysql', name: 'MySQL', category: 'Database', description: 'Relational data models, normalization, indexing, and SQL queries.', color: '#00758f', drawType: 'mysql' },
  { id: 'postgres', name: 'PostgreSQL', category: 'Database', description: 'ACID relational modeling, complex joins, schemas, and extensions.', color: '#336791', drawType: 'postgres' },
  { id: 'mongodb', name: 'MongoDB', category: 'Database', description: 'NoSQL document persistence, aggregation pipelines, and indexing.', color: '#47a248', drawType: 'mongodb' },
  { id: 'docker', name: 'Docker', category: 'DevOps', description: 'Containerization, reproducible deployment images, and microservices.', color: '#2496ed', drawType: 'docker' },
  { id: 'git', name: 'Git', category: 'Version Control', description: 'Distributed branch management, rebasing, and source code tracking.', color: '#f05032', drawType: 'git' },
  { id: 'github', name: 'GitHub', category: 'Collaboration', description: 'Repositories, pull requests, automated CI/CD workflows, and issues.', color: '#181717', drawType: 'github' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Styling', description: 'Utility-first responsive design tokens and high-performance layouts.', color: '#38bdf8', drawType: 'tailwind' },
  { id: 'nextjs', name: 'Next.js', category: 'Full-Stack', description: 'App Router, Server Components, SSR, and production web performance.', color: '#000000', drawType: 'nextjs' },
  { id: 'redux', name: 'Redux / State', category: 'State Management', description: 'Predictable application state container and immutable state trees.', color: '#764abc', drawType: 'redux' },
  { id: 'vscode', name: 'VS Code', category: 'Tools', description: 'Primary IDE, debugging pipelines, extensions, and workspace configs.', color: '#0066b8', drawType: 'vscode' },
  { id: 'postman', name: 'Postman', category: 'Tools', description: 'API contract testing, environment variables, and endpoint validation.', color: '#ff6c37', drawType: 'postman' },
  { id: 'redis', name: 'Redis', category: 'Database / Cache', description: 'In-memory key-value data structure store, caching, and pub/sub.', color: '#dc382d', drawType: 'redis' }
];

const NUM_ROWS = 12; // Latitude bands
const NUM_COLS = 24; // Longitude segments

// Map grid coordinates (row, col) to a technology item
function getTechForCell(row: number, col: number): TechItem {
  // Balanced distribution with pseudo-random offset so neighboring cells are varied
  const index = (row * 7 + col * 3 + Math.floor(row / 2)) % TECH_DATABASE.length;
  return TECH_DATABASE[index];
}

// Generate the high-resolution texture matching the reference globe photograph
function createGlobeCanvasTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Base Globe Surface: soft light sky-blue / pale cyan matching the photo
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
      const size = Math.min(cellW, cellH) * 0.62;

      ctx.save();
      ctx.translate(cx, cy);

      // Render authentic logo shape for each tech
      renderLogoIcon(ctx, tech.drawType, size);

      ctx.restore();
    }
  }

  // 3. Coordinate Grid Lines (Parallels & Meridians)
  ctx.strokeStyle = '#273444';
  ctx.lineWidth = 1.8;

  // Horizontal Latitude Parallels
  for (let r = 0; r <= NUM_ROWS; r++) {
    const y = r * cellH;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Vertical Longitude Meridians
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

  // Subtle tick marks along the equator
  ctx.fillStyle = '#0f172a';
  for (let c = 0; c <= NUM_COLS * 2; c++) {
    const tx = (c * width) / (NUM_COLS * 2);
    ctx.fillRect(tx - 1, equatorY - 5, 2, 10);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

// Vector drawing routines for each technology emblem
function renderLogoIcon(ctx: CanvasRenderingContext2D, type: string, size: number) {
  const r = size / 2;

  switch (type) {
    case 'html5': {
      // Orange Shield
      ctx.fillStyle = '#e44d26';
      ctx.beginPath();
      ctx.moveTo(-r * 0.75, -r * 0.85);
      ctx.lineTo(r * 0.75, -r * 0.85);
      ctx.lineTo(r * 0.6, r * 0.6);
      ctx.lineTo(0, r * 0.95);
      ctx.lineTo(-r * 0.6, r * 0.6);
      ctx.closePath();
      ctx.fill();

      // Inner lighter facet
      ctx.fillStyle = '#f16529';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.72);
      ctx.lineTo(r * 0.62, -r * 0.72);
      ctx.lineTo(r * 0.5, r * 0.5);
      ctx.lineTo(0, r * 0.8);
      ctx.closePath();
      ctx.fill();

      // White "5"
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.52)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('5', 0, r * 0.05);
      break;
    }

    case 'css3': {
      // Blue Shield
      ctx.fillStyle = '#264de4';
      ctx.beginPath();
      ctx.moveTo(-r * 0.75, -r * 0.85);
      ctx.lineTo(r * 0.75, -r * 0.85);
      ctx.lineTo(r * 0.6, r * 0.6);
      ctx.lineTo(0, r * 0.95);
      ctx.lineTo(-r * 0.6, r * 0.6);
      ctx.closePath();
      ctx.fill();

      // Inner lighter facet
      ctx.fillStyle = '#2965f1';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.72);
      ctx.lineTo(r * 0.62, -r * 0.72);
      ctx.lineTo(r * 0.5, r * 0.5);
      ctx.lineTo(0, r * 0.8);
      ctx.closePath();
      ctx.fill();

      // White "3"
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.52)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('3', 0, r * 0.05);
      break;
    }

    case 'js': {
      // Yellow Rounded Rectangle
      ctx.fillStyle = '#f7df1e';
      drawRoundedRect(ctx, -r * 0.85, -r * 0.85, r * 1.7, r * 1.7, r * 0.22);
      ctx.fill();

      // Black "JS"
      ctx.fillStyle = '#000000';
      ctx.font = `900 ${Math.round(size * 0.44)}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('JS', r * 0.72, r * 0.75);
      break;
    }

    case 'ts': {
      // Blue Rounded Rectangle
      ctx.fillStyle = '#3178c6';
      drawRoundedRect(ctx, -r * 0.85, -r * 0.85, r * 1.7, r * 1.7, r * 0.22);
      ctx.fill();

      // White "TS"
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.round(size * 0.44)}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('TS', r * 0.72, r * 0.75);
      break;
    }

    case 'react': {
      // Dark Disc
      ctx.fillStyle = '#20232a';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
      ctx.fill();

      // Cyan Atom Ellipses
      ctx.strokeStyle = '#00d8ff';
      ctx.lineWidth = 2.2;
      for (let angle = 0; angle < Math.PI; angle += Math.PI / 3) {
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.72, r * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Nucleus
      ctx.fillStyle = '#00d8ff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'vue': {
      // Green Outer V
      ctx.fillStyle = '#42b883';
      ctx.beginPath();
      ctx.moveTo(-r * 0.85, -r * 0.75);
      ctx.lineTo(r * 0.85, -r * 0.75);
      ctx.lineTo(0, r * 0.85);
      ctx.closePath();
      ctx.fill();

      // Navy Inner V
      ctx.fillStyle = '#35495e';
      ctx.beginPath();
      ctx.moveTo(-r * 0.46, -r * 0.75);
      ctx.lineTo(r * 0.46, -r * 0.75);
      ctx.lineTo(0, r * 0.1);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'angular': {
      // Red Shield
      ctx.fillStyle = '#dd0031';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.9);
      ctx.lineTo(r * 0.8, -r * 0.55);
      ctx.lineTo(r * 0.6, r * 0.6);
      ctx.lineTo(0, r * 0.95);
      ctx.lineTo(-r * 0.6, r * 0.6);
      ctx.lineTo(-r * 0.8, -r * 0.55);
      ctx.closePath();
      ctx.fill();

      // White "A"
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.54)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('A', 0, r * 0.08);
      break;
    }

    case 'node': {
      // Green Hexagon
      ctx.fillStyle = '#539e43';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const x = r * 0.85 * Math.cos(a);
        const y = r * 0.85 * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // White "node"
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.28)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('node', 0, 0);
      break;
    }

    case 'python': {
      // Blue Serpent
      ctx.fillStyle = '#3776ab';
      drawRoundedRect(ctx, -r * 0.75, -r * 0.75, r * 0.9, r * 0.7, r * 0.2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-r * 0.35, -r * 0.45, r * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Yellow Serpent
      ctx.fillStyle = '#ffd438';
      drawRoundedRect(ctx, -r * 0.15, 0, r * 0.9, r * 0.7, r * 0.2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(r * 0.35, r * 0.45, r * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      break;
    }

    case 'java': {
      // White Background Circle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // Orange Steaming Cup
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(0, r * 0.18, r * 0.45, 0, Math.PI);
      ctx.fill();

      // Cup Handle
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(r * 0.45, r * 0.18, r * 0.16, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // Red Steam Wisps
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-r * 0.2, -r * 0.05);
      ctx.quadraticCurveTo(-r * 0.3, -r * 0.35, -r * 0.1, -r * 0.6);
      ctx.moveTo(r * 0.1, -r * 0.05);
      ctx.quadraticCurveTo(r * 0.0, -r * 0.35, r * 0.2, -r * 0.6);
      ctx.stroke();
      break;
    }

    case 'php': {
      // Purple Oval
      ctx.fillStyle = '#777bb4';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.9, r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // White "php"
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold italic ${Math.round(size * 0.36)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('php', 0, 0);
      break;
    }

    case 'ruby': {
      // Red Faceted Gem
      ctx.fillStyle = '#cc342d';
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, -r * 0.6);
      ctx.lineTo(r * 0.6, -r * 0.6);
      ctx.lineTo(r * 0.85, -r * 0.15);
      ctx.lineTo(0, r * 0.85);
      ctx.lineTo(-r * 0.85, -r * 0.15);
      ctx.closePath();
      ctx.fill();

      // Gem Facet highlights
      ctx.strokeStyle = '#ff8f8a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.35, -r * 0.6);
      ctx.lineTo(-r * 0.5, -r * 0.15);
      ctx.lineTo(0, r * 0.85);
      ctx.lineTo(r * 0.5, -r * 0.15);
      ctx.lineTo(r * 0.35, -r * 0.6);
      ctx.stroke();
      break;
    }

    case 'mysql': {
      // Navy Blue Disc
      ctx.fillStyle = '#00758f';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // Leaping Dolphin Silhouette
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.45, Math.PI * 0.8, Math.PI * 1.8);
      ctx.lineTo(r * 0.45, -r * 0.35);
      ctx.lineTo(r * 0.1, r * 0.15);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'postgres': {
      // Blue Disc
      ctx.fillStyle = '#336791';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // Elephant Silhouette
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-r * 0.1, -r * 0.1, r * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-r * 0.15, -r * 0.1, r * 0.6, r * 0.35);
      ctx.beginPath();
      ctx.arc(r * 0.4, r * 0.2, r * 0.14, 0, Math.PI);
      ctx.fill();
      break;
    }

    case 'mongodb': {
      // Green Leaf
      ctx.fillStyle = '#47a248';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.85);
      ctx.quadraticCurveTo(r * 0.75, 0, 0, r * 0.85);
      ctx.quadraticCurveTo(-r * 0.75, 0, 0, -r * 0.85);
      ctx.fill();

      // Leaf Central Spine
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.75);
      ctx.lineTo(0, r * 0.75);
      ctx.stroke();
      break;
    }

    case 'docker': {
      // Blue Whale
      ctx.fillStyle = '#2496ed';
      ctx.beginPath();
      ctx.arc(0, r * 0.2, r * 0.65, 0, Math.PI);
      ctx.lineTo(-r * 0.8, 0);
      ctx.closePath();
      ctx.fill();

      // Stacked Cargo Containers
      ctx.fillStyle = '#ffffff';
      for (let row = 0; row < 2; row++) {
        for (let col = -1; col <= 1; col++) {
          ctx.fillRect(col * r * 0.24 - r * 0.1, -r * 0.1 - row * r * 0.24, r * 0.2, r * 0.18);
        }
      }
      break;
    }

    case 'git': {
      // Orange Tilted Diamond
      ctx.save();
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#f05032';
      drawRoundedRect(ctx, -r * 0.65, -r * 0.65, r * 1.3, r * 1.3, r * 0.2);
      ctx.fill();

      // Git Nodes
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.arc(-r * 0.25, 0, r * 0.14, 0, Math.PI * 2);
      ctx.arc(r * 0.25, -r * 0.25, r * 0.14, 0, Math.PI * 2);
      ctx.arc(r * 0.25, r * 0.25, r * 0.14, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-r * 0.25, 0);
      ctx.lineTo(r * 0.25, -r * 0.25);
      ctx.moveTo(-r * 0.25, 0);
      ctx.lineTo(r * 0.25, r * 0.25);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'github': {
      // Black Disc
      ctx.fillStyle = '#181717';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // Octocat Silhouette
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Cat Ears
      ctx.beginPath();
      ctx.moveTo(-r * 0.35, -r * 0.2);
      ctx.lineTo(-r * 0.25, -r * 0.6);
      ctx.lineTo(-r * 0.05, -r * 0.35);
      ctx.moveTo(r * 0.05, -r * 0.35);
      ctx.lineTo(r * 0.25, -r * 0.6);
      ctx.lineTo(r * 0.35, -r * 0.2);
      ctx.fill();
      break;
    }

    case 'tailwind': {
      // Dark Blue Disc
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // Cyan Dual Wave Curves
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.55, r * 0.1);
      ctx.quadraticCurveTo(-r * 0.2, -r * 0.4, 0, -r * 0.1);
      ctx.quadraticCurveTo(r * 0.2, r * 0.2, r * 0.55, -r * 0.1);
      ctx.stroke();
      break;
    }

    case 'nextjs': {
      // Black Disc
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // White Angled "N"
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold italic ${Math.round(size * 0.58)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', 0, 0);
      break;
    }

    default: {
      // Clean fallback badge with initials
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.34)}px sans-serif`;
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
  const currentRotation = useRef(0.85); // Initial showcase orientation

  // Radius of the planet globe (1.30m radius = 2.60m diameter, grand planetary installation)
  const radius = 1.30;

  // Memoize high-res procedural textures
  const globeCanvasTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createGlobeCanvasTexture();
  }, []);

  // Pointer drag interactions around the tilted polar axis
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDragging.current = true;
    previousPointer.current = { x: e.clientX, y: e.clientY };
    rotationVelocity.current = 0;
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

  const resetOrientation = () => {
    currentRotation.current = 0.85;
    rotationVelocity.current = 0;
    setActiveTech(null);
  };

  useFrame((_, delta) => {
    if (!globeSpinRef.current) return;

    if (!isDragging.current) {
      // Continuous natural planetary rotation around its tilted polar axis
      if (!isReducedMotion) {
        currentRotation.current += delta * (isSkills ? 0.24 : 0.12);
      }
      // Damped decay of drag momentum
      currentRotation.current += rotationVelocity.current;
      rotationVelocity.current *= 0.94;
    }

    // Spin smoothly around the tilted polar Y axis
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
      {/* Soft Contact Ambient Floor Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <circleGeometry args={[1.35, 48]} />
        <meshBasicMaterial color="#080b12" transparent opacity={0.7} />
      </mesh>

      {/* Luminous Floor Orbital Alignment Rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[1.48, 1.54, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0]}>
        <ringGeometry args={[1.74, 1.76, 64]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.3} />
      </mesh>

      {/* ================= 2. PLANETARY TILTED AXIS ASSEMBLY (NO HANDLE / NO STAND) ================= */}
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
            position={[0, radius + 0.32, 0]}
            center
            distanceFactor={7.5}
            className="pointer-events-auto select-none z-30"
          >
            <div className="w-[280px] bg-[#0c121e]/98 border border-white/20 rounded-xl p-3.5 shadow-2xl text-white font-sans space-y-2 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: activeTech.color }}
                  />
                  <h4 className="font-bold text-sm text-white font-['Outfit']">{activeTech.name}</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#94a3b8] font-mono">
                    {activeTech.category}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTech(null)}
                  className="p-1 text-[#94a3b8] hover:text-white transition-colors"
                  aria-label="Close skill info"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {activeTech.description}
              </p>

              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified in codebase</span>
                </div>
                <span className="text-[#38bdf8]">N/VERSE</span>
              </div>
            </div>
          </Html>
        )}

        {/* Reset Orientation Control */}
        <Html
          position={[0, -(radius + 0.28), 0]}
          center
          distanceFactor={8.8}
          className="pointer-events-auto select-none"
        >
          <div className="flex items-center gap-2.5 bg-[#0b1018]/90 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-full shadow-lg">
            <button
              onClick={resetOrientation}
              className="flex items-center gap-1 text-[11px] font-mono text-[#94a3b8] hover:text-[#38bdf8] transition-colors"
              aria-label="Reset Globe Rotation"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset View</span>
            </button>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-1 text-[10px] font-mono text-[#64748b]">
              <Globe2 className="w-3 h-3 text-[#38bdf8]" />
              <span>Drag to spin</span>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
