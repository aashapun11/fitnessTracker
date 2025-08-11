


const CalorieCalculate = ({ activity, duration, exercise_type, sets = 0, reps = 0, equipmentWeight = 0, user }) => {
  if(!user) return 0;
  const { age, sex, weight: userWeight, height } = user;

  const MET_VALUES = {
    Running: 9.8,
    Cycling: 7.5,
    Swimming: 8.0,
    Walking: 3.5,
  };

  if (!age || !sex || !userWeight || !height) return 0;

  let calories = 0;

  if (exercise_type === "Cardio") {
    const met = MET_VALUES[activity];
    if (!met) return 0;

    const bmr = sex === "male"
      ? 10 * userWeight + 6.25 * height - 5 * age + 5
      : 10 * userWeight + 6.25 * height - 5 * age - 161;

    const durationHours = duration / 60;
    calories = (met * bmr / 24) * durationHours;
  }

  else if (exercise_type === "Strength") {
    calories = sets * reps * 0.35;
  }

  else if (exercise_type === "WeightTraining") {
    calories = sets * reps * equipmentWeight * 0.03;
  }


  return calories.toFixed(2);
};

export default CalorieCalculate;
