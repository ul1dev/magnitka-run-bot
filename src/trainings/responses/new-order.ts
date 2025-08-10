import { getZero } from 'src/libs/common';
import { CreateTrainingSignupDto } from '../dto/create-training-signup.dto';

const trainingDirections = {
  individual: 'Индивидуальные',
  group: 'Групповые',
  online: 'Дистанционные (онлайн)',
  corporate: 'Корпоративные тренировки',
};

const trainingLevels = {
  beginner: 'Начинающий (никогда не занимался)',
  intermediate: 'Средний (занимался ранее)',
  advanced: 'Продвинутый (регулярные тренировки)',
};

export const newTrainingSignUpMessage = (
  traqiningSignUp: CreateTrainingSignupDto,
) => {
  const dateTrain = new Date(traqiningSignUp.datetime);

  return `🏃‍♂️ <b>Новая запись на тренировку</b>

Имя: <code>${traqiningSignUp.name}</code>
Телефон: <code>${traqiningSignUp.phone}</code>${traqiningSignUp.email ? `\nПочта: ${traqiningSignUp.email}` : ''}

Направление тренировки: <code>${trainingDirections[traqiningSignUp.directions]}</code>
Уровень подготовки: <code>${trainingLevels[traqiningSignUp.level]}</code>
Дата и время: <code>${getZero(dateTrain.getDate())}.${getZero(dateTrain.getMonth() + 1)}.${dateTrain.getFullYear()} ${getZero(dateTrain.getHours())}:${getZero(dateTrain.getMinutes())}</code>

${
  traqiningSignUp.comments
    ? `Комментарии или пожелания:\n${traqiningSignUp.comments}`
    : ''
}`;
};
