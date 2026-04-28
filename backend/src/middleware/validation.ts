import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        өріс: e.path.join('.'),
        хабарлама: e.message,
      }));
      res.status(400).json({ қате: 'Деректер дұрыс емес', бұзылыстар: errors });
      return;
    }
    req.body = result.data;
    next();
  };
};

export const registerSchema = z.object({
  аты: z.string({ required_error: 'Аты міндетті' }).min(1, 'Аты бос болуы мүмкін емес'),
  эл_пошта: z.string({ required_error: 'Эл. пошта міндетті' }).email('Дұрыс эл. пошта мекенжайын енгізіңіз'),
  құпия_сөз: z
    .string({ required_error: 'Құпия сөз міндетті' })
    .min(6, 'Құпия сөз кемінде 6 символдан тұруы керек'),
});

export const loginSchema = z.object({
  эл_пошта: z.string({ required_error: 'Эл. пошта міндетті' }).email('Дұрыс эл. пошта мекенжайын енгізіңіз'),
  құпия_сөз: z.string({ required_error: 'Құпия сөз міндетті' }),
});

export const clientSchema = z.object({
  аты: z.string({ required_error: 'Аты міндетті' }).min(1),
  эл_пошта: z.string({ required_error: 'Эл. пошта міндетті' }).email(),
  телефон: z.string({ required_error: 'Телефон міндетті' }).min(1),
  компания: z.string().optional(),
  мекен_жай: z.string().optional(),
  статус: z.enum(['белсенді', 'болашақ', 'бұрынғы']).optional(),
  жауапты_менеджер: z.string({ required_error: 'Жауапты менеджер міндетті' }).min(1),
  ескертпелер: z.string().optional(),
});

export const saleSchema = z.object({
  тақырып: z.string({ required_error: 'Тақырып міндетті' }).min(1),
  клиент: z.string({ required_error: 'Клиент міндетті' }).min(1),
  менеджер: z.string({ required_error: 'Менеджер міндетті' }).min(1),
  сомасы: z.number({ required_error: 'Сомасы міндетті' }).min(0),
  статус: z.enum(['жаңа', 'келіссөздер', 'ұсыныс', 'жеңілген', 'жеңілді']).optional(),
  сатыс: z.string().optional(),
  мүмкіндік_пайызы: z.number().min(0).max(100).optional(),
  болжамды_жабылу: z.string({ required_error: 'Болжамды жабылу күні міндетті' }),
});

export const activitySchema = z.object({
  тақырып: z.string({ required_error: 'Тақырып міндетті' }).min(1),
  түрі: z.enum(['қоңырау', 'кездесу', 'тапсырма', 'эл_пошта'], {
    required_error: 'Түрі міндетті',
  }),
  сипаттамасы: z.string().optional(),
  клиент: z.string({ required_error: 'Клиент міндетті' }).min(1),
  менеджер: z.string({ required_error: 'Менеджер міндетті' }).min(1),
  күні: z.string({ required_error: 'Күні міндетті' }),
  статус: z.enum(['жоспарланған', 'орындалды', 'күтіліп_жатыр', 'болдырылмады']).optional(),
});
