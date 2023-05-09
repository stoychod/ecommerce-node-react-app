import pool from "./pool";

const product = {
  getById: async (producId: number) => {
    const statement = "SELECT * FROM product WHERE id = $1";
    const result = await pool.query(statement, [producId]);
    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  },
};

export default product;
