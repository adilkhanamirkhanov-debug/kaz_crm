import { Response } from 'express';
import Client from '../models/Client';
import Sale from '../models/Sale';
import Activity from '../models/Activity';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      жалпы_клиенттер,
      белсенді_клиенттер,
      жалпы_сатулар,
    ] = await Promise.all([
      Client.countDocuments(),
      Client.countDocuments({ статус: 'белсенді' }),
      Sale.countDocuments(),
    ]);

    const revenueResult = await Sale.aggregate([
      { $match: { статус: 'жеңілді' } },
      { $group: { _id: null, жалпы: { $sum: '$сомасы' } } },
    ]);
    const жалпы_табыс = revenueResult.length > 0 ? revenueResult[0].жалпы : 0;

    const статус_бойынша_сатулар = await Sale.aggregate([
      { $group: { _id: '$статус', саны: { $sum: 1 } } },
    ]);

    const соңғы_іс_шаралар = await Activity.find()
      .sort({ жасалған_уақыт: -1 })
      .limit(5)
      .populate('клиент', 'аты')
      .populate('менеджер', 'аты');

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const ай_бойынша_табыс = await Sale.aggregate([
      { $match: { статус: 'жеңілді', жасалған_уақыт: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$жасалған_уақыт' } },
          табыс: { $sum: '$сомасы' },
          саны: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      жалпы_клиенттер,
      белсенді_клиенттер,
      жалпы_сатулар,
      жалпы_табыс,
      статус_бойынша_сатулар,
      соңғы_іс_шаралар,
      ай_бойынша_табыс,
    });
  } catch (error) {
    res.status(500).json({ қате: 'Сервер қатесі', тереңдетме: (error as Error).message });
  }
};
