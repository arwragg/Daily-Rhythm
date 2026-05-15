export default async (req, context) => {
  const response = await context.next();
  response.headers.set(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' blob:; style-src * 'unsafe-inline'; img-src * data: blob:; connect-src *;"
  );
  return response;
};

export const config = {
  path: "/*"
};
