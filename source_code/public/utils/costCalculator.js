async function getTotalCost() {
    const [costResult] = await db.query(`
        SELECT SUM(R.amount * I.cost * J.quantity) AS totalCost
        FROM Orders O
        JOIN JSON_TABLE(O.orderDetails, '$[*]' COLUMNS (
            name VARCHAR(255) PATH '$.name',
            quantity INT PATH '$.quantity'
        )) AS J ON 1=1
        JOIN recipes R ON J.name = R.sandwich
        JOIN inventory I ON R.ingredient = I.name
        WHERE DATE(O.createdAt) = CURDATE();
    `);
    return costResult.totalCost || 0;
}