export const relativeTime = (timeStamp: string | number) => {
  const d = new Date(timeStamp),
    now = new Date(),
    secondsPast = (now.getTime() - d.getTime()) / 1000,
    months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

  if (secondsPast < 60) {
    const rounded = Math.round(secondsPast);
    return rounded === 1
      ? "A"
      : rounded + ` second${rounded === 1 ? null : "s"} ago`;
  }
  if (secondsPast < 3600) {
    const rounded = Math.round(secondsPast / 60);
    return rounded === 1
      ? "A"
      : rounded + ` minute${rounded === 1 ? null : "s"} ago`;
  }
  if (secondsPast <= 86400) {
    const rounded = Math.round(secondsPast / 3600);
    return rounded === 1
      ? "An"
      : rounded + ` hour${rounded === 1 ? null : "s"} ago`;
  }
  if (secondsPast <= 604800) {
    const rounded = Math.round(secondsPast / 86400);
    return rounded === 1
      ? "A"
      : rounded + ` day${rounded === 1 ? null : "s"} ago`;
  }

  if (secondsPast > 604800) {
    return (
      d.getDate().toString().padStart(2, "0"),
      months[d.getMonth()],
      d.getFullYear() == now.getFullYear() ? "" : " " + d.getFullYear()
    );
  }
};
