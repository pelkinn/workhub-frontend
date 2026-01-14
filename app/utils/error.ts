export const getErrorMessageResponse = (
  err: unknown,
  defaultMessage = "Произошла ошибка"
) => {
  const errorData = err as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return (
    errorData?.response?.data?.message || errorData?.message || defaultMessage
  );
};
