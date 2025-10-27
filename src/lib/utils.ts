import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Download utility functions
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(data: Record<string, any> | Array<Record<string, any>>, filename: string) {
  let csvContent = '';
  
  if (Array.isArray(data)) {
    // Handle array of objects
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
  } else {
    // Handle object
    const entries = Object.entries(data);
    csvContent = [
      ['Key', 'Value'].join(','),
      ...entries.map(([key, value]) => `"${key}","${value}"`)
    ].join('\n');
  }
  
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

export function exportToJSON(data: any, filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}

export function exportToHTML(data: Record<string, any> | Array<Record<string, any>>, title: string, filename: string) {
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #DC2626; }
        h2 { color: #F59E0B; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #DC2626; color: white; }
        .metric { font-size: 24px; font-weight: bold; color: #DC2626; }
        .label { color: #666; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
  `;

  if (Array.isArray(data)) {
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      htmlContent += `
        <table>
          <thead>
            <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${data.map(row => 
              `<tr>${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}</tr>`
            ).join('')}
          </tbody>
        </table>
      `;
    }
  } else {
    htmlContent += `
      <table>
        ${Object.entries(data).map(([key, value]) => 
          `<tr><td class="label">${key}</td><td class="metric">${value}</td></tr>`
        ).join('')}
      </table>
    `;
  }

  htmlContent += `
    </body>
    </html>
  `;

  downloadFile(htmlContent, `${filename}.html`, 'text/html');
}

export function exportToPDF(data: Record<string, any> | Array<Record<string, any>>, title: string, filename: string) {
  // For PDF generation, we'll use the HTML export and let the browser handle PDF conversion
  // In a production environment, you might want to use a library like jsPDF or Puppeteer
  exportToHTML(data, title, filename);
}
