const PDFDocument = require('pdfkit');

/**
 * Generate a PDF report of medication logs
 * @param {Array} logs - Array of dose logs
 * @param {Date} from - Start date
 * @param {Date} to - End date
 * @returns {Promise<Buffer>} - PDF buffer
 */
exports.generatePDFReport = (logs, from, to) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      // PDF content
      doc.fontSize(20).text('Medication Adherence Report', { align: 'center' });
      doc.moveDown();
      
      // Date range
      if (from && to) {
        doc.fontSize(12).text(
          `Report from ${new Date(from).toDateString()} to ${new Date(to).toDateString()}`,
          { align: 'center' }
        );
      }
      
      doc.moveDown(2);
      
      // Table header
      doc.font('Helvetica-Bold');
      doc.text('Date', 50, doc.y);
      doc.text('Time', 150, doc.y);
      doc.text('Medication', 220, doc.y);
      doc.text('Dose', 350, doc.y);
      doc.text('Status', 420, doc.y);
      doc.moveDown();
      
      // Table rows
      doc.font('Helvetica');
      logs.forEach(log => {
        const date = log.scheduledTime.toISOString().split('T')[0];
        const time = log.scheduledTime.toTimeString().split(' ')[0];
        
        doc.text(date, 50, doc.y);
        doc.text(time, 150, doc.y);
        doc.text(log.medicationId.name, 220, doc.y);
        doc.text(log.medicationId.dose, 350, doc.y);
        
        // Color code status
        if (log.status === 'taken') doc.fill('green');
        else if (log.status === 'late') doc.fill('orange');
        else doc.fill('red');
        
        doc.text(log.status.charAt(0).toUpperCase() + log.status.slice(1), 420, doc.y);
        doc.fill('black'); // Reset color
        
        doc.moveDown();
      });
      
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};