


const CalorieCalculate = ({ activity, duration, user }) => {
  if(!user) return 0;
  const { age, sex, weight, height } = user;

  const MET_VALUES = {
    Running: 9.8,
    Cycling: 7.5,
    Swimming: 8.0,
    Walking: 3.5,
    Pushups: 8.0,
    MountainClimb: 8.0,
    Burpees: 10.0,
  };

  if (!age || !sex || !weight || !height) return 0;

  const met = MET_VALUES[activity];
  if (!met) return 0;

  let bmr;
  if (sex === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const durationHours = duration / 60;
  const caloriesBurned = (met * bmr / 24) * durationHours;

  return caloriesBurned.toFixed(2);
};

export default CalorieCalculate;
