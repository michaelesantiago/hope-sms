-- 001_initial_schema.sql — M3 DB Engineer
-- All 6 HopeDB tables. record_status + stamp added to sales and salesDetail ONLY.

DROP TABLE IF EXISTS salesDetail CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS priceHist CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS jobHistory CASCADE;
DROP TABLE IF EXISTS job CASCADE;
DROP TABLE IF EXISTS department CASCADE;
DROP TABLE IF EXISTS employee CASCADE;

CREATE TABLE employee (
  empno VARCHAR(5) NOT NULL PRIMARY KEY, lastname VARCHAR(15), firstname VARCHAR(15),
  gender CHAR(1) CONSTRAINT gender_ck CHECK (gender IN ('M','F')),
  birthdate DATE, hiredate DATE, sepDate DATE
);
CREATE TABLE department (deptCode VARCHAR(3) NOT NULL PRIMARY KEY, deptName VARCHAR(20));
CREATE TABLE job (jobCode VARCHAR(4) NOT NULL PRIMARY KEY, jobDesc VARCHAR(20));
CREATE TABLE jobHistory (
  empNo VARCHAR(5) NOT NULL REFERENCES employee, jobCode VARCHAR(4) NOT NULL REFERENCES job,
  effDate DATE NOT NULL, salary DECIMAL(10,2) CONSTRAINT salary_ck CHECK (salary >= 0),
  deptCode VARCHAR(4) REFERENCES department, PRIMARY KEY (empNo, jobCode, effDate)
);
CREATE TABLE customer (
  custno VARCHAR(5) NOT NULL PRIMARY KEY, custname VARCHAR(20), address VARCHAR(50),
  payterm VARCHAR(3) CONSTRAINT pay_ck CHECK (payterm IN ('COD','30D','45D'))
);
CREATE TABLE product (
  prodCode VARCHAR(6) NOT NULL PRIMARY KEY, description VARCHAR(30),
  unit VARCHAR(3) CONSTRAINT unit_ck CHECK (unit IN ('pc','ea','mtr','pkg','ltr'))
);
CREATE TABLE sales (
  transNo VARCHAR(8) NOT NULL PRIMARY KEY, salesDate DATE,
  custNo VARCHAR(5) REFERENCES customer, empNo VARCHAR(5) REFERENCES employee,
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE' CONSTRAINT sales_status_ck CHECK (record_status IN ('ACTIVE','INACTIVE')),
  stamp VARCHAR(60)
);
CREATE TABLE payment (
  orNo VARCHAR(8) NOT NULL PRIMARY KEY, payDate DATE, amount DECIMAL(10,2),
  transno VARCHAR(8) REFERENCES sales
);
CREATE TABLE salesDetail (
  transNo VARCHAR(8) NOT NULL REFERENCES sales, prodCode VARCHAR(6) NOT NULL REFERENCES product,
  quantity DECIMAL(10,2) CONSTRAINT quantity_ck CHECK (quantity >= 0),
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE' CONSTRAINT sd_status_ck CHECK (record_status IN ('ACTIVE','INACTIVE')),
  stamp VARCHAR(60), PRIMARY KEY (transNo, prodCode)
);
CREATE TABLE priceHist (
  effDate DATE NOT NULL, prodCode VARCHAR(6) NOT NULL REFERENCES product,
  unitPrice DECIMAL(10,2) CONSTRAINT unitP_ck CHECK (unitPrice > 0),
  PRIMARY KEY (effDate, prodCode)
);
