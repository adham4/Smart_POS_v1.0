const { exec } = require('child_process');

// ✅ دالة لإعادة تشغيل السيرفر
exports.restartServer = (req, res) => {
    try {
        console.log('🚀 Restarting server...');

        // ✅ تشغيل أمر Node.js لإعادة تشغيل السيرفر
        exec('pm2 restart server', (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error restarting server: ${error.message}`);
                return res.status(500).json({ message: 'Failed to restart server' });
            }
            if (stderr) {
                console.error(`❌ Stderr: ${stderr}`);
                return res.status(500).json({ message: 'Error during server restart' });
            }
            console.log(`✅ Server restarted successfully: ${stdout}`);
            res.json({ message: 'Server restarted successfully!' });
        });

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        res.status(500).json({ message: 'Unexpected error during server restart' });
    }
};