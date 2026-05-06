-- 002_rights_seed.sql — M3 DB Engineer
-- Rights & Auth tables + SUPERADMIN seed

CREATE TABLE IF NOT EXISTS "user" (
  userId VARCHAR(36) NOT NULL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE, firstName VARCHAR(50), lastName VARCHAR(50),
  email VARCHAR(100) NOT NULL UNIQUE,
  user_type VARCHAR(15) NOT NULL DEFAULT 'USER' CONSTRAINT user_type_ck CHECK (user_type IN ('SUPERADMIN','ADMIN','USER')),
  record_status VARCHAR(10) NOT NULL DEFAULT 'INACTIVE' CONSTRAINT user_status_ck CHECK (record_status IN ('ACTIVE','INACTIVE')),
  stamp VARCHAR(60)
);
CREATE TABLE IF NOT EXISTS Module (moduleCode VARCHAR(20) NOT NULL PRIMARY KEY, moduleName VARCHAR(50), record_status VARCHAR(10) DEFAULT 'ACTIVE', stamp VARCHAR(60));
CREATE TABLE IF NOT EXISTS user_module (userId VARCHAR(36) NOT NULL REFERENCES "user", moduleCode VARCHAR(20) NOT NULL REFERENCES Module, rights_value INTEGER NOT NULL DEFAULT 0 CHECK (rights_value IN (0,1)), PRIMARY KEY (userId, moduleCode));
CREATE TABLE IF NOT EXISTS rights (rightCode VARCHAR(20) NOT NULL PRIMARY KEY, rightName VARCHAR(50), right_order INTEGER, moduleCode VARCHAR(20) REFERENCES Module, record_status VARCHAR(10) DEFAULT 'ACTIVE', stamp VARCHAR(60));
CREATE TABLE IF NOT EXISTS UserModule_Rights (userId VARCHAR(36) NOT NULL REFERENCES "user", rightCode VARCHAR(20) NOT NULL REFERENCES rights, right_value INTEGER NOT NULL DEFAULT 0 CHECK (right_value IN (0,1)), PRIMARY KEY (userId, rightCode));

INSERT INTO Module VALUES ('Sales_Mod','Sales Module','ACTIVE','SEEDED'),('SD_Mod','Sales Detail Module','ACTIVE','SEEDED'),('Lookup_Mod','Lookup Module','ACTIVE','SEEDED'),('Adm_Mod','Admin Module','ACTIVE','SEEDED');

INSERT INTO rights VALUES
  ('SALES_VIEW','View Transactions',1,'Sales_Mod','ACTIVE','SEEDED'),
  ('SALES_ADD','Create Transaction',2,'Sales_Mod','ACTIVE','SEEDED'),
  ('SALES_EDIT','Edit Transaction',3,'Sales_Mod','ACTIVE','SEEDED'),
  ('SALES_DEL','Soft Delete Transaction',4,'Sales_Mod','ACTIVE','SEEDED'),
  ('SD_VIEW','View Sales Detail',5,'SD_Mod','ACTIVE','SEEDED'),
  ('SD_ADD','Add Line Item',6,'SD_Mod','ACTIVE','SEEDED'),
  ('SD_EDIT','Edit Line Item',7,'SD_Mod','ACTIVE','SEEDED'),
  ('SD_DEL','Soft Delete Line Item',8,'SD_Mod','ACTIVE','SEEDED'),
  ('CUST_LOOKUP','Look Up Customers',9,'Lookup_Mod','ACTIVE','SEEDED'),
  ('EMP_LOOKUP','Look Up Employees',10,'Lookup_Mod','ACTIVE','SEEDED'),
  ('PROD_LOOKUP','Look Up Products',11,'Lookup_Mod','ACTIVE','SEEDED'),
  ('PRICE_LOOKUP','Look Up Price History',12,'Lookup_Mod','ACTIVE','SEEDED'),
  ('ADM_USER','Admin Activate User',13,'Adm_Mod','ACTIVE','SEEDED');

-- REPLACE 'user1' with the actual Supabase auth.uid() after creating jcesperanza@neu.edu.ph
INSERT INTO "user" (userId,username,firstName,lastName,email,user_type,record_status,stamp)
VALUES ('user1','jcesperanza','Jeremias','Esperanza','jcesperanza@neu.edu.ph','SUPERADMIN','ACTIVE','SEEDED-SUPERADMIN');

INSERT INTO user_module VALUES ('user1','Sales_Mod',1),('user1','SD_Mod',1),('user1','Lookup_Mod',1),('user1','Adm_Mod',1);

INSERT INTO UserModule_Rights VALUES
  ('user1','SALES_VIEW',1),('user1','SALES_ADD',1),('user1','SALES_EDIT',1),('user1','SALES_DEL',1),
  ('user1','SD_VIEW',1),('user1','SD_ADD',1),('user1','SD_EDIT',1),('user1','SD_DEL',1),
  ('user1','CUST_LOOKUP',1),('user1','EMP_LOOKUP',1),('user1','PROD_LOOKUP',1),('user1','PRICE_LOOKUP',1),
  ('user1','ADM_USER',1);
