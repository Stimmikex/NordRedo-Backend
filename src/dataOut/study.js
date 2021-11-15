/* School */
/**
 * getSchoolByID(int id)
 * @param {*} id 
 * @returns <JSON> School by inserted id 
 */
export async function getSchoolByID(id) {
    const q = `SELECT * FROM school WHERE id = $1`;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }
/**
 * getSchoolByName(String name)
 * @param {*} name 
 * @returns <JSON> School by inserted name 
 */
export async function getSchoolByName(name) {
    const q = `SELECT * FROM school WHERE name = $1`;
    try {
      const result = await query(q, [name]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

/* Classes */
/**
 * getClassById(int id)
 * @param {*} id 
 * @returns <JSON> Class by inserted id
 */
export async function getClassByID(id) {
    const q = `SELECT * FROM class WHERE id = $1`;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }
/**
 * getClassByName(string name)
 * @param {*} id 
 * @returns <JSON> Class by inserted name
 */
export async function getClassByName(name) {
    const q = `SELECT * FROM class WHERE name = $1`;
    try {
      const result = await query(q, [name]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

/* Year */
/**
 * getYearsByClassID(int class_id)
 * @param {*} class_id 
 * @returns <JSON> gets years by class id
 */
export async function getYearsByClassID(class_id) {
    const q = `SELECT * FROM year WHERE class_id = $1`;
    try {
      const result = await query(q, [class_id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }
/**
 * getYearById(int id)
 * @param {*} id 
 * @returns <JSON> get Year by inserted id
 */
export async function getYearByID(id) {
    const q = `SELECT * FROM year WHERE id = $1`;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

/* Note */
/**
 * getNotesByYearID(int id)
 * @param {*} id 
 * @returns <JSON> get notes by the year id
 */
export async function getNotesByYearID(id) {
    const q = `SELECT * FROM note WHERE year_id = $1`;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }
/**
 * getNotesByClassID(int id)
 * @param {*} id 
 * @returns <JSON> get Notes by the class id
 */
export async function getNotesByClassID(id) {
    const q = `SELECT * FROM note WHERE year_id = (SELECT year.id FROM  WHERE class_id = $1)`;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

export async function getNotesByUserID(id) {
    const q = `SELECT * FROM note WHERE user_id = $1`;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

export async function getNoteByID(id) {
    const q = `SELECT * FROM note WHERE id = $1`;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

/* Comments */
export async function getCommentByID(id) {
    const q = ``;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

export async function getCommentsByNoteID(id) {
    const q = ``;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

export async function getCommentsByUserID(id) {
    const q = ``;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

export async function searchCommentsbyText(id) {
    const q = ``;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }