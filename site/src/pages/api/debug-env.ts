// Temporary debug endpoint - DELETE after verification
export const prerender = false;

export async function GET() {
  return new Response(JSON.stringify({
    hasAdminUser: !!import.meta.env.ADMIN_USER,
    hasAdminPass: !!import.meta.env.ADMIN_PASS,
    adminUserLength: import.meta.env.ADMIN_USER?.length || 0,
    adminPassLength: import.meta.env.ADMIN_PASS?.length || 0,
    // DO NOT log actual values for security
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}