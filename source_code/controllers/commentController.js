const { Comment } = require('../models');

// ✅ إضافة تعليق جديد
const addComment = async (req, res) => {
    try {
        const { commentText, color, price } = req.body;

        // 🔥 التحقق من البيانات
        if (!commentText.trim() || !color.trim() || typeof price !== 'number') {
            return res.status(400).json({ message: '❌ commentText, color و price مطلوبين ويجب أن يكون price رقمًا.' });
        }

        const newComment = await Comment.create({ commentText, color, price });
        res.status(201).json(newComment);
    } catch (error) {
        console.error('❌ خطأ أثناء إضافة التعليق:', error);
        res.status(500).json({ message: '❌ حدث خطأ أثناء إضافة التعليق', error });
    }
};

// ✅ جلب التعليقات
const getPopularComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            attributes: ['id', 'commentText', 'createdAt', 'color', 'price'], // ✅ إضافة السعر
            order: [['createdAt', 'DESC']],
            limit: 10 // ✅ آخر 10 تعليقات فقط
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error('❌ خطأ أثناء جلب التعليقات:', error);
        res.status(500).json({ message: '❌ فشل في جلب التعليقات', error });
    }
};

// ✅ حذف تعليق
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: '❌ التعليق غير موجود' });
        }

        await comment.destroy();
        res.status(200).json({ message: `✅ تم حذف التعليق: "${comment.commentText}" بنجاح` });
    } catch (error) {
        console.error('❌ خطأ أثناء حذف التعليق:', error);
        res.status(500).json({ message: '❌ حدث خطأ أثناء حذف التعليق', error });
    }
};

module.exports = {
    addComment,
    getPopularComments,
    deleteComment
};