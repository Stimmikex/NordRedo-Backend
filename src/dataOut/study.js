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
export async function getClassesByID(id) {
    const q = ``;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

export async function getClassessByName(name) {
    const q = ``;
    try {
      const result = await query(q, [name]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

/* Year */
export async function getYearsByClassID(class_id) {
    const q = ``;
    try {
      const result = await query(q, [class_id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

export async function getYearByID(id) {
    const q = ``;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

/* Note */
export async function getNotesByYearID(id) {
    const q = ``;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

export async function getNotesByClassID(id) {
    const q = ``;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

export async function getNotesByUserID(id) {
    const q = ``;
    try {
      const result = await query(q, [id]);
      return result.rows;
    } catch (e) {
      console.error('Error occured :>> ', e);
      return null;
    }
  }

export async function getNoteByID(id) {
    const q = ``;
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