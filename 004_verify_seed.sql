-- 004_verify_seed.sql — M3 DB Engineer
-- Run after seeding to confirm correctness

SELECT 'employee' AS tbl, COUNT(*) FROM employee
UNION ALL SELECT 'customer', COUNT(*) FROM customer
UNION ALL SELECT 'product', COUNT(*) FROM product
UNION ALL SELECT 'sales', COUNT(*) FROM sales
UNION ALL SELECT 'salesDetail', COUNT(*) FROM salesDetail
UNION ALL SELECT 'priceHist', COUNT(*) FROM priceHist;
-- Expected: employee=31, customer=82, product=52, sales=124, salesDetail~310, priceHist~70

SELECT 'sales' AS tbl, record_status, COUNT(*) FROM sales GROUP BY record_status
UNION ALL SELECT 'salesDetail', record_status, COUNT(*) FROM salesDetail GROUP BY record_status;
-- Expected: only ACTIVE rows

SELECT COUNT(*) AS orphaned_custNo FROM sales s WHERE NOT EXISTS (SELECT 1 FROM customer c WHERE c.custno=s.custNo);
SELECT COUNT(*) AS orphaned_empNo  FROM sales s WHERE NOT EXISTS (SELECT 1 FROM employee e WHERE e.empno=s.empNo);
SELECT COUNT(*) AS orphaned_transNo FROM salesDetail sd WHERE NOT EXISTS (SELECT 1 FROM sales s WHERE s.transNo=sd.transNo);
-- All expected: 0

SELECT u.username, u.user_type, COUNT(umr.rightCode) AS total, SUM(umr.right_value) AS enabled
FROM "user" u JOIN "UserModule_Rights" umr ON umr.userId=u.userId WHERE u.user_type='SUPERADMIN'
GROUP BY u.username, u.user_type;
-- Expected: total=13, enabled=13
