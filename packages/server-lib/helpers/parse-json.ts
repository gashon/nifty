export default function parseJSON(json: string | any) {
  try { return JSON.parse(json); } catch (err) { return json; }
}
