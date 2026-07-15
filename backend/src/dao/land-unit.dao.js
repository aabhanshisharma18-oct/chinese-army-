const pool = require('./database');

class LandUnitDao {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM land_units ORDER BY id'
    );

    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM land_units WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  async create(data) {
    const query = `
      INSERT INTO land_units (
        side,
        formation_unit_name,
        formation_unit_type,
        formation_unit_parent_name,
        standard_unit_formation,
        unit_potential_troops,
        location_name,
        latitude,
        longitude
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      data.side,
      data.formationUnitName,
      data.formationUnitType,
      data.formationUnitParentName,
      data.standardUnitFormation,
      data.unitPotentialTroops,
      data.locationName,
      data.latitude,
      data.longitude
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
  }

  async update(id, data) {
    const query = `
      UPDATE land_units
      SET
        side = $1,
        formation_unit_name = $2,
        formation_unit_type = $3,
        formation_unit_parent_name = $4,
        standard_unit_formation = $5,
        unit_potential_troops = $6,
        location_name = $7,
        latitude = $8,
        longitude = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `;

    const values = [
      data.side,
      data.formationUnitName,
      data.formationUnitType,
      data.formationUnitParentName,
      data.standardUnitFormation,
      data.unitPotentialTroops,
      data.locationName,
      data.latitude,
      data.longitude,
      id
    ];

    const result = await pool.query(query, values);

    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM land_units WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rows[0] || null;
  }
}

module.exports = new LandUnitDao();
