export const getNowUTCDate = (incHours = 0) => {
  const nowDate = new Date(new Date().toUTCString().replace('GMT', ''));
  const totalHours = new Date().getUTCHours() + incHours;
  nowDate.setUTCHours(totalHours);

  return nowDate;
};
