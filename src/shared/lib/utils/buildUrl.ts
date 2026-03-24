const replaceParams = (template: string, params: Record<string, string | number>): string => {
  let url = template;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  return url;
};

export const buildUrl = (
  base: string,
  template: string,
  params: Record<string, string | number>
): string => {
  const url = params ? replaceParams(template, params) : template;
  return `${base}/${url}`;
};
