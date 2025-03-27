async function updateInventory(orderDetails) {
    for (const item of orderDetails) {
        const query = `
            UPDATE inventory i
            JOIN recipes r ON r.ingredient = i.name
            SET i.quantity = CASE 
                WHEN i.quantity >= (r.amount * ?) THEN i.quantity - (r.amount * ?)
                ELSE i.quantity 
            END
            WHERE r.sandwich = ?;
        `;
        await db.query(query, [item.quantity, item.quantity, item.name]);
    }
}