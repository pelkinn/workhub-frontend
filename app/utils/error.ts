export const getErrorMessageResponse = (
  err: unknown,
  defaultMessage = "Произошла ошибка"
) => {
  const errorData = err as {
    data: { message?: string } | undefined;
    message?: string;
  };
  return errorData?.data?.message || errorData?.message || defaultMessage;
};
