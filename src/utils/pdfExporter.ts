import html2pdf from 'html2pdf.js';
import { PrototypeProject } from '../types';

export const exportProjectPRDToPDF = async (project: PrototypeProject) => {
  // Create a clean, offscreen formatted DOM element for the PRD PDF export
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.padding = '40px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  container.style.color = '#1f2937';
  container.style.lineHeight = '1.6';

  const specsHtml = project.specs.map((spec, index) => {
    let contentStr = '';
    if (typeof spec.content === 'string') {
      contentStr = spec.content;
    } else {
      // In case ReactNode is passed, convert text content safely
      contentStr = String(spec.content) || '';
    }

    return `
      <div style="margin-bottom: 28px; page-break-inside: avoid;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; border-bottom: 2px solid #3b82f6; padding-bottom: 6px;">
          <span style="background-color: #2563eb; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">${index + 1}</span>
          <h3 style="font-size: 16px; font-weight: 700; color: #1e3a8a; margin: 0;">${spec.title}</h3>
        </div>
        <div style="padding-left: 12px; color: #374151; font-size: 13px; white-space: pre-wrap; line-height: 1.7;">${contentStr}</div>
      </div>
    `;
  }).join('');

  const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });

  container.innerHTML = `
    <div style="border-bottom: 3px solid #1e40af; padding-bottom: 16px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px;">
        <span style="font-size: 12px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 1px;">乐淘 RAKUTAO · 产品需求文档 (PRD)</span>
        <span style="font-size: 11px; color: #6b7280;">导出时间: ${nowStr}</span>
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #111827; margin: 0 0 8px 0;">${project.name}</h1>
      <div style="display: flex; gap: 12px; font-size: 12px; color: #4b5563; margin-bottom: 12px;">
        <span style="background-color: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-weight: 600;">分类: ${project.category}</span>
        ${project.redmineUrl ? `<span style="background-color: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 4px;">Redmine: ${project.redmineUrl}</span>` : ''}
      </div>
      <p style="font-size: 13px; color: #4b5563; margin: 0; background-color: #f9fafb; padding: 12px; border-radius: 6px; border-left: 4px solid #3b82f6;">
        <strong>项目概述：</strong>${project.description}
      </p>
    </div>

    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
        📄 详细功能与交互需求规范
      </h2>
      ${specsHtml}
    </div>

    <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center;">
      本文档由 RAKUTAO 原型设计平台自动生成 · 机密内部资料 · 请勿外传
    </div>
  `;

  document.body.appendChild(container);

  const opt = {
    margin: 10,
    filename: `${project.name}_需求文档.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } catch (err) {
    console.error('Failed to export PDF via html2pdf:', err);
    // Fallback if needed
    window.print();
  } finally {
    document.body.removeChild(container);
  }
};
