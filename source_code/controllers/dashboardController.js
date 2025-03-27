const { Order, sequelize } = require('../models');
const { Op } = require('sequelize');
const printer = require('node-thermal-printer');

// ✅ الدالة لجلب بيانات الـ Dashboard (تعتمد على قاعدة البيانات)
exports.getDashboardData = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const totalOrders = await Order.count({
            where: {
                createdAt: {
                    [Op.startsWith]: today,
                },
            },
        });

        res.json({ totalOrders });
    } catch (error) {
        console.error('❌ Error in getDashboardData:', error);
        res.status(500).json({ error: 'Database connection error. Please check the system status.' });
    }
};

// ✅ الدالة للتحقق من حالة النظام (مستقلة عن قاعدة البيانات)
exports.checkSystemStatus = async (req, res) => {
    try {
        let systemStatus = 'All Systems Operational ✅';
        let internetStatus = 'Connected ✅';
        let databaseStatus = 'Connected ✅';
        let printerStatus = 'Connected ✅';

        // ✅ التحقق من اتصال الإنترنت
        try {
            await fetch('https://www.google.com');
            console.log('✅ Internet Connection: OK');
        } catch (error) {
            console.error('❌ Internet Connection Error:', error);
            internetStatus = 'No Internet Connection ❌';
            systemStatus = 'Internet Issue Detected ❌';
        }

        // ✅ التحقق من اتصال قاعدة البيانات
        try {
            await sequelize.authenticate();
            console.log('✅ Database Connection: OK');
        } catch (error) {
            console.error('❌ Database Connection Error:', error);
            databaseStatus = 'Database Not Connected ❌';
            systemStatus = 'Database Issue Detected ❌';
        }

        // ✅ التحقق من اتصال الطابعة الحرارية
        try {
            printer.init({
                type: 'epson',
                interface: 'usb',
            });

            if (!(await printer.isPrinterConnected())) {
                throw new Error('Printer not connected');
            }

            console.log('✅ Thermal Printer Connected');
        } catch (error) {
            console.error('❌ Thermal Printer Connection Error:', error);
            printerStatus = 'Printer Not Connected ❌';
            systemStatus = 'Printer Issue Detected ❌';
        }

        res.json({
            systemStatus,
            internetStatus,
            databaseStatus,
            printerStatus,
        });

    } catch (error) {
        console.error('❌ Error in checkSystemStatus:', error);
        res.status(500).json({ error: 'An error occurred while checking system status.' });
    }
};

