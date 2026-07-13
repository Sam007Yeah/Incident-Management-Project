import type { Incident } from '../types/incidentType.js';
import DB from '../DB/db.js';

export function incidentService() {


    return {

        async getAllIncidents(): Promise<Incident[]> {
            const query = `
                SELECT * FROM incidents
            `;
            const result = await DB.query(query);
            return result.rows;
        },

        async getIncidentById(id: string): Promise<Incident | null> {
            const query = `
                SELECT * FROM incidents WHERE id = $1
            `;
            const result = await DB.query(query, [id]);
            if (result.rows.length === 0)
                return null;
            return result.rows[0];
        },

        async getIncidentByTeamId(teamId: string): Promise<Incident[]> {
            const query = `
                SELECT * FROM incidents WHERE assigned_team = $1
            `;
            const result = await DB.query(query, [teamId]);
            return result.rows;
        },

        async createIncident(incident: Partial<Incident>) {
            const query = `
                INSERT INTO incidents (id, title, description, status, priority, start_date, updated_at, created_by_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            const values = [incident.id, incident.title, incident.description, 'open', incident.priority,
            new Date(Date.now()), new Date(Date.now()), incident.created_by_id];
            console.log("Creating incident with values:", values, "and query:", query);
            await DB.query(query, values);
        },

        async updateIncident(id: string, incident: Partial<Incident>): Promise<string | null> {
            const fields = Object.keys(incident);
            const values = Object.values(incident);
            const updatedAt = new Date(Date.now());
            fields.push('updated_at');
            values.push(updatedAt);
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

            const query = `
                UPDATE incidents SET ${setClause} WHERE id = $${fields.length + 1}
            `;
            values.push(id);
            const result = await DB.query(query, values);
            if (result.rowCount === 0) {
                return null;
            }
            return "Incident updated successfully";
        },

        async filterIncidents(filters: Partial<Incident>): Promise<Incident[]> {
            const filterKeys = Object.keys(filters);
            const filterValues = Object.values(filters);
            const whereClause = filterKeys.map((key, index) => `${key} = $${index + 1} `).join(' AND ');
            const query = `
                SELECT * FROM incidents WHERE ${whereClause}
            `;
            const result = await DB.query(query, filterValues);
            return result.rows;
        }

    }
}

