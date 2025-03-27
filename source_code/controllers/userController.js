const { User } = require("../models"); // ✅ تأكد أن الموديل `User` موجود

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "❌ خطأ في جلب المستخدمين" });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const newUser = await User.create({ username, password, role });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "❌ خطأ في إنشاء المستخدم" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role } = req.body;
        const updatedUser = await User.update({ username, role }, { where: { id } });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "❌ خطأ في تحديث المستخدم" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.json({ message: "✅ تم حذف المستخدم بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "❌ خطأ في حذف المستخدم" });
    }
};

exports.getUserRole = async (req, res) => {
    try {
        console.log("🛠️ التحقق من الصلاحيات لليوزر ID:", req.user.id);

        const user = await Users.findOne({ where: { id: req.user.id } });

        if (!user) {
            console.log("❌ المستخدم غير موجود!");
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        console.log("✅ دور المستخدم:", user.role);
        res.json({ role: user.role });
    } catch (error) {
        console.error("❌ خطأ أثناء جلب بيانات المستخدم:", error);
        res.status(500).json({ message: "خطأ في السيرفر الداخلي" });
    }
};
