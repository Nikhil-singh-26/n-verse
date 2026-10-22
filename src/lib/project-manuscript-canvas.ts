import { ProjectData } from '@/types';

// Helper for text wrapping in Canvas 2D
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 6
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let linesCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      linesCount++;
      if (linesCount >= maxLines - 1 && n < words.length - 1) {
        let lastLine = line;
        while (n < words.length && ctx.measureText(lastLine + '...').width < maxWidth) {
          n++;
          lastLine += (words[n] || '') + ' ';
        }
        ctx.fillText(lastLine.trim() + '...', x, currentY);
        return currentY + lineHeight;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

// Rounded rectangle helper
function roundRect(
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

export function drawProjectManuscript(
  canvas: HTMLCanvasElement,
  project: ProjectData,
  index: number,
  totalProjects: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. BASE AGED PARCHMENT BACKGROUND
  const baseGrad = ctx.createRadialGradient(w * 0.45, h * 0.45, 120, w / 2, h / 2, w * 0.75);
  baseGrad.addColorStop(0, '#fbf3e2');
  baseGrad.addColorStop(0.5, '#f4e5c7');
  baseGrad.addColorStop(0.85, '#e9d4ad');
  baseGrad.addColorStop(1, '#ddc297');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle antique discoloration patinas
  const stain1 = ctx.createRadialGradient(220, 220, 10, 220, 220, 380);
  stain1.addColorStop(0, 'rgba(168, 125, 78, 0.16)');
  stain1.addColorStop(1, 'rgba(168, 125, 78, 0)');
  ctx.fillStyle = stain1;
  ctx.fillRect(0, 0, 600, 600);

  const stain2 = ctx.createRadialGradient(w - 280, h - 240, 20, w - 280, h - 240, 420);
  stain2.addColorStop(0, 'rgba(150, 105, 58, 0.18)');
  stain2.addColorStop(1, 'rgba(150, 105, 58, 0)');
  ctx.fillStyle = stain2;
  ctx.fillRect(w - 700, h - 660, 700, 660);

  // 2. DOUBLE DECKLED ARCHIVAL BORDER
  // Outer antique border
  ctx.strokeStyle = 'rgba(110, 80, 50, 0.85)';
  ctx.lineWidth = 4;
  ctx.strokeRect(26, 26, w - 52, h - 52);

  // Inner dashed decorative border
  ctx.strokeStyle = 'rgba(140, 105, 68, 0.65)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(38, 38, w - 76, h - 76);
  ctx.setLineDash([]);

  // Corner Antique Iron Tacks
  const tackPositions = [
    [48, 48],
    [w - 48, 48],
    [48, h - 48],
    [w - 48, h - 48]
  ];
  tackPositions.forEach(([tx, ty]) => {
    ctx.beginPath();
    ctx.arc(tx, ty, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#22160d';
    ctx.fill();
    ctx.strokeStyle = '#63472f';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(tx - 2, ty - 2, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#543b27';
    ctx.fill();
  });

  // 3. WAX SEAL EMBOSSED STAMP (TOP-RIGHT)
  const sealX = w - 165;
  const sealY = 138;
  const sealR = 62;

  // Outer wax seal rim with radial shaded depth
  const sealGrad = ctx.createRadialGradient(sealX - 14, sealY - 14, 8, sealX, sealY, sealR);
  sealGrad.addColorStop(0, '#c43e22');
  sealGrad.addColorStop(0.7, '#8f2512');
  sealGrad.addColorStop(1, '#5c1407');
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.fillStyle = sealGrad;
  ctx.shadowColor = 'rgba(28, 14, 8, 0.55)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Inner wax disc
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 13, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 220, 185, 0.4)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Seal Monogram
  ctx.fillStyle = '#fdf2e4';
  ctx.font = 'bold 20px "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('N-VERSE', sealX, sealY - 8);
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.fillText('VERIFIED', sealX, sealY + 14);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // 4. ARCHIVAL FOLIO HEADER (LARGER & HIGH CONTRAST)
  // Folio Tagline
  ctx.font = 'bold 21px "Courier New", monospace';
  ctx.fillStyle = '#593a1f';
  ctx.fillText(`ARCHIVUM N-VERSE  •  FOLIO NO. 0${index + 1} OF 0${totalProjects}  •  ${project.category.toUpperCase()}`, 74, 90);

  // Project Title (Large, Bold & Ultra Clear)
  ctx.font = 'bold 82px "Georgia", "Times New Roman", serif';
  ctx.fillStyle = '#0a0502';
  ctx.fillText(project.title, 74, 164);

  // Tagline
  ctx.font = 'bold italic 28px "Georgia", serif';
  ctx.fillStyle = '#4a2c16';
  ctx.fillText(`“${project.tagline}”`, 74, 206);

  // Specification Status Badge (placed left of seal)
  const statusText = `STATUS: ${project.status.toUpperCase()} • SPEC APPROVED`;
  ctx.font = 'bold 16px "Courier New", monospace';
  const statusWidth = ctx.measureText(statusText).width;
  const statusBoxX = sealX - sealR - statusWidth - 36;
  const statusBoxY = 76;
  roundRect(ctx, statusBoxX, statusBoxY, statusWidth + 24, 36, 5);
  ctx.fillStyle = 'rgba(139, 37, 18, 0.12)';
  ctx.fill();
  ctx.strokeStyle = '#851c0c';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#851c0c';
  ctx.fillText(statusText, statusBoxX + 12, statusBoxY + 24);

  // Header dividing horizontal rules
  ctx.strokeStyle = 'rgba(110, 80, 50, 0.75)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(70, 228);
  ctx.lineTo(w - 70, 228);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(150, 115, 80, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(70, 235);
  ctx.lineTo(w - 70, 235);
  ctx.stroke();

  // 5. TWO-COLUMN BALANCED LAYOUT
  const colDividerX = 1140;
  const bodyTopY = 270;

  // Vertical dividing rule between columns
  ctx.strokeStyle = 'rgba(125, 92, 58, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(colDividerX, bodyTopY);
  ctx.lineTo(colDividerX, h - 145);
  ctx.stroke();

  // ================= LEFT COLUMN =================
  let leftY = bodyTopY;
  const leftColW = colDividerX - 74 - 36; // ~1030px

  // Section I: Abstract & Motivation
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillStyle = '#4a2f19';
  ctx.fillText('§ I. SYSTEM ABSTRACT & CORE MOTIVATION:', 74, leftY);
  leftY += 34;

  // Deep crimson vertical accent bar on abstract
  ctx.strokeStyle = '#851c0c';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(78, leftY - 18);
  ctx.lineTo(78, leftY + 92);
  ctx.stroke();

  ctx.font = 'bold italic 28px "Georgia", serif';
  ctx.fillStyle = '#0f0a06';
  leftY = wrapText(ctx, project.purpose, 98, leftY, leftColW - 14, 42, 4);
  leftY += 28;

  // Section II: Operational Functionalities
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillStyle = '#4a2f19';
  ctx.fillText("§ II. INVENTOR'S OPERATIONAL HEURISTICS:", 74, leftY);
  leftY += 36;

  project.keyFunctionality.slice(0, 3).forEach((feat) => {
    ctx.font = 'bold 26px "Georgia", serif';
    ctx.fillStyle = '#851c0c';
    ctx.fillText('◈', 82, leftY);

    ctx.font = 'bold 26px "Georgia", serif';
    ctx.fillStyle = '#100a06';
    leftY = wrapText(ctx, feat, 114, leftY, leftColW - 30, 38, 3);
    leftY += 14;
  });
  leftY += 20;

  // Section III: Configured Technologies Matrix
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillStyle = '#4a2f19';
  ctx.fillText('§ III. CONFIGURED APPARATUS MATRIX (TECH STACK):', 74, leftY);
  leftY += 32;

  let pillX = 74;
  let pillY = leftY;
  project.technologies.slice(0, 8).forEach((tech) => {
    ctx.font = 'bold 21px "Courier New", monospace';
    const textW = ctx.measureText(tech).width;
    const pillW = textW + 34;

    if (pillX + pillW > colDividerX - 30) {
      pillX = 74;
      pillY += 54;
    }

    roundRect(ctx, pillX, pillY, pillW, 46, 6);
    ctx.fillStyle = 'rgba(235, 218, 185, 0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(115, 80, 48, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#1a0e07';
    ctx.fillText(tech, pillX + 17, pillY + 30);

    pillX += pillW + 14;
  });

  // ================= RIGHT COLUMN =================
  let rightY = bodyTopY;
  const rightX = colDividerX + 40;
  const rightColW = w - rightX - 74; // ~794px

  // Section IV: Handcrafted Technical Schematic Diagram
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillStyle = '#4a2f19';
  ctx.fillText(`§ IV. TECHNICAL SCHEMATIC // FIG. 0${index + 1}:`, rightX, rightY);
  rightY += 30;

  // Diagram Box Frame (Prominent, High Contrast)
  const diagBoxW = rightColW;
  const diagBoxH = 330;
  roundRect(ctx, rightX, rightY, diagBoxW, diagBoxH, 8);
  ctx.fillStyle = 'rgba(245, 235, 212, 0.75)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(135, 98, 60, 0.75)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Schematic Drawing based on Project
  const diagCenterX = rightX + diagBoxW / 2;
  const diagCenterY = rightY + diagBoxH / 2;

  ctx.strokeStyle = '#22140a';
  ctx.fillStyle = '#22140a';
  ctx.lineWidth = 3.5;

  if (project.id === 'the-brew-club') {
    // 1. The Brew Club: Balance beam & peer ledger schematic
    // Center pillar
    ctx.beginPath();
    ctx.moveTo(diagCenterX, diagCenterY - 80);
    ctx.lineTo(diagCenterX, diagCenterY + 80);
    ctx.moveTo(diagCenterX - 70, diagCenterY + 80);
    ctx.lineTo(diagCenterX + 70, diagCenterY + 80);
    ctx.stroke();

    // Fulcrum balance beam
    ctx.beginPath();
    ctx.moveTo(diagCenterX - 170, diagCenterY - 30);
    ctx.lineTo(diagCenterX + 170, diagCenterY - 55);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.lineWidth = 3.5;

    // Left supporter pan
    ctx.beginPath();
    ctx.moveTo(diagCenterX - 170, diagCenterY - 30);
    ctx.lineTo(diagCenterX - 215, diagCenterY + 25);
    ctx.moveTo(diagCenterX - 170, diagCenterY - 30);
    ctx.lineTo(diagCenterX - 125, diagCenterY + 25);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(diagCenterX - 170, diagCenterY + 25, 52, 14, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Right creator pan
    ctx.beginPath();
    ctx.moveTo(diagCenterX + 170, diagCenterY - 55);
    ctx.lineTo(diagCenterX + 125, diagCenterY);
    ctx.moveTo(diagCenterX + 170, diagCenterY - 55);
    ctx.lineTo(diagCenterX + 215, diagCenterY);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(diagCenterX + 170, diagCenterY, 52, 14, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Labels
    ctx.font = 'bold italic 20px "Georgia", serif';
    ctx.fillStyle = '#422510';
    ctx.fillText('Direct Peer Patronage Pan', diagCenterX - 235, diagCenterY + 68);
    ctx.fillText('Creator Payout (0% Cut)', diagCenterX + 45, diagCenterY + 45);
  } else if (project.id === 'shrinka-url') {
    // 2. Shrinka URL: High-Performance URL Shortener Pipeline Schematic
    const pipeY = diagCenterY - 15;

    // Input URL Box
    const inBoxX = diagCenterX - 350;
    const inBoxW = 200;
    roundRect(ctx, inBoxX, pipeY - 45, inBoxW, 70, 6);
    ctx.fillStyle = '#eedec5';
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillStyle = '#22140a';
    ctx.fillText('INPUT: LONG URL', inBoxX + 16, pipeY - 20);
    ctx.font = 'italic 13px "Georgia", serif';
    ctx.fillStyle = '#634427';
    ctx.fillText('https://domain/path...', inBoxX + 16, pipeY + 10);

    // Connecting arrow 1
    ctx.beginPath();
    ctx.moveTo(inBoxX + inBoxW, pipeY - 10);
    ctx.lineTo(inBoxX + inBoxW + 45, pipeY - 10);
    ctx.lineTo(inBoxX + inBoxW + 35, pipeY - 20);
    ctx.moveTo(inBoxX + inBoxW + 45, pipeY - 10);
    ctx.lineTo(inBoxX + inBoxW + 35, pipeY);
    ctx.stroke();

    // Central Base62 Hashing & Redirection Engine
    const coreBoxX = diagCenterX - 85;
    const coreBoxW = 170;
    roundRect(ctx, coreBoxX, pipeY - 60, coreBoxW, 100, 8);
    ctx.fillStyle = '#851c0c';
    ctx.fill();
    ctx.strokeStyle = '#5a1207';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillText('BASE62 ENGINE', coreBoxX + 22, pipeY - 26);
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillText('Hash & Collision Map', coreBoxX + 12, pipeY - 4);
    ctx.font = 'bold 13px "Georgia", serif';
    ctx.fillStyle = '#fed7aa';
    ctx.fillText('⚡ Latency < 0.4ms', coreBoxX + 18, pipeY + 22);

    // Connecting arrow 2
    ctx.strokeStyle = '#22140a';
    ctx.beginPath();
    ctx.moveTo(coreBoxX + coreBoxW, pipeY - 10);
    ctx.lineTo(coreBoxX + coreBoxW + 45, pipeY - 10);
    ctx.lineTo(coreBoxX + coreBoxW + 35, pipeY - 20);
    ctx.moveTo(coreBoxX + coreBoxW + 45, pipeY - 10);
    ctx.lineTo(coreBoxX + coreBoxW + 35, pipeY);
    ctx.stroke();

    // Output Shortened Link & QR Matrix Box
    const outBoxX = diagCenterX + 150;
    const outBoxW = 200;
    roundRect(ctx, outBoxX, pipeY - 45, outBoxW, 70, 6);
    ctx.fillStyle = '#eedec5';
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillStyle = '#851c0c';
    ctx.fillText('VANITY SHORT LINK', outBoxX + 16, pipeY - 20);
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillStyle = '#22140a';
    ctx.fillText('shrinka-url.../x9k2', outBoxX + 16, pipeY + 10);

    // Bottom Telemetry Note
    ctx.font = 'bold italic 19px "Georgia", serif';
    ctx.fillStyle = '#422510';
    ctx.fillText('Dynamic QR Code Synthesis & Real-Time Click Stream Analytics', diagCenterX - 290, pipeY + 85);
  } else if (project.id === 'roadvision') {
    // 3. RoadVision: Perspective Road & Hazard Detection
    const roadTopX = diagCenterX;
    const roadTopY = diagCenterY - 70;

    // Vanishing perspective lines
    ctx.beginPath();
    ctx.moveTo(roadTopX - 220, diagCenterY + 85);
    ctx.lineTo(roadTopX - 30, roadTopY);
    ctx.moveTo(roadTopX + 220, diagCenterY + 85);
    ctx.lineTo(roadTopX + 30, roadTopY);
    ctx.stroke();

    // Center dashed line
    ctx.setLineDash([10, 7]);
    ctx.beginPath();
    ctx.moveTo(roadTopX, roadTopY);
    ctx.lineTo(roadTopX, diagCenterY + 85);
    ctx.stroke();
    ctx.setLineDash([]);

    // Bounding Box 1 (Hazard)
    ctx.strokeStyle = '#851c0c';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(roadTopX - 125, diagCenterY + 5, 75, 52);
    ctx.fillStyle = 'rgba(133, 28, 12, 0.16)';
    ctx.fillRect(roadTopX - 125, diagCenterY + 5, 75, 52);

    // Bounding Box 2
    ctx.strokeRect(roadTopX + 55, diagCenterY - 25, 65, 45);
    ctx.fillRect(roadTopX + 55, diagCenterY - 25, 65, 45);
    ctx.setLineDash([]);
    ctx.strokeStyle = '#22140a';
    ctx.lineWidth = 3.5;

    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillStyle = '#851c0c';
    ctx.fillText('Target: Asphalt Distress (94.2%)', roadTopX - 150, diagCenterY + 76);
    ctx.fillText('Target: Surface Pothole (89.6%)', roadTopX + 20, diagCenterY + 38);
  } else if (project.id === 'know-via') {
    // 4. Know Via: Associative Synapse Graph & Android Mobile APK
    const hubX = diagCenterX;
    const hubY = diagCenterY - 15;

    const nodes = [
      { x: hubX, y: hubY, r: 28, label: 'Central Concept' },
      { x: hubX - 170, y: hubY - 55, r: 20, label: 'Android APK' },
      { x: hubX - 150, y: hubY + 65, r: 18, label: 'SQLite Store' },
      { x: hubX + 165, y: hubY - 50, r: 22, label: 'Markdown Notes' },
      { x: hubX + 155, y: hubY + 60, r: 19, label: 'Backlink Graph' }
    ];

    // Connection lines
    nodes.slice(1).forEach((nd, i) => {
      ctx.beginPath();
      ctx.moveTo(hubX, hubY);
      ctx.lineTo(nd.x, nd.y);
      if (i % 2 === 0) ctx.setLineDash([6, 5]);
      else ctx.setLineDash([]);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Draw node discs
    nodes.forEach((nd) => {
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
      ctx.fillStyle = '#ecd8bc';
      ctx.fill();
      ctx.strokeStyle = '#22140a';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = 'bold 17px "Georgia", serif';
      ctx.fillStyle = '#22140a';
      ctx.fillText(nd.label, nd.x - nd.r - 12, nd.y + nd.r + 20);
    });
  }

  rightY += diagBoxH + 34;

  // Section V: Architectural Notes
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillStyle = '#4a2f19';
  ctx.fillText('§ V. VERIFIED ARCHITECTURAL HIGHLIGHTS:', rightX, rightY);
  rightY += 34;

  project.details.highlights.slice(0, 2).forEach((hl) => {
    ctx.font = 'bold 32px "Georgia", serif';
    ctx.fillStyle = '#851c0c';
    ctx.fillText('•', rightX + 6, rightY);

    ctx.font = 'bold italic 25px "Georgia", serif';
    ctx.fillStyle = '#100a06';
    rightY = wrapText(ctx, hl, rightX + 32, rightY, rightColW - 38, 36, 3);
    rightY += 14;
  });

  // 6. MANUSCRIPT FOOTER (ACTION BUTTONS & PAGINATION)
  const footerY = h - 130;

  ctx.strokeStyle = 'rgba(110, 80, 50, 0.75)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(70, footerY);
  ctx.lineTo(w - 70, footerY);
  ctx.stroke();

  // Button 1: Examine Source Repository (GitHub)
  const btn1X = 74;
  const btn1Y = footerY + 22;
  const btn1W = 440;
  const btn1H = 64;
  roundRect(ctx, btn1X, btn1Y, btn1W, btn1H, 8);
  ctx.fillStyle = '#1c120a';
  ctx.fill();
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.fillStyle = '#fdf4e4';
  ctx.fillText('⚓ EXAMINE SOURCE REPOSITORY', btn1X + 28, btn1Y + 40);

  // Button 2: Observe Running Apparatus (Live Demo) or Specific Repo Badge
  const hasLiveUrl = !!(project.liveDemoUrl || project.links?.live);
  const btn2X = btn1X + btn1W + 28;
  const btn2Y = btn1Y;
  const btn2W = 440;
  const btn2H = btn1H;
  roundRect(ctx, btn2X, btn2Y, btn2W, btn2H, 8);

  if (hasLiveUrl) {
    ctx.fillStyle = '#851c0c';
    ctx.fill();
    ctx.strokeStyle = '#b8341e';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('✦ OBSERVE RUNNING APPARATUS', btn2X + 28, btn2Y + 40);
  } else if (project.id === 'know-via') {
    ctx.fillStyle = '#1e2430';
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('📦 ANDROID APK REPOSITORY', btn2X + 32, btn2Y + 40);
  } else {
    ctx.fillStyle = '#1e2430';
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('🔬 REPOSITORY EXPERIMENT', btn2X + 32, btn2Y + 40);
  }

  // Subdued Folio Pagination Stamp
  ctx.font = 'bold italic 22px "Georgia", serif';
  ctx.fillStyle = '#593a1f';
  ctx.textAlign = 'right';
  ctx.fillText(`Manuscript Folio 0${index + 1} of 0${totalProjects}  •  Projector Station`, w - 74, footerY + 54);
  ctx.textAlign = 'left';
}
