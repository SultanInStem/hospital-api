import cron from 'node-cron';
import PatientMedicalRecord from "../db/models/PatientMedicalRecords.js";
import Service from "../db/models/Service.js";
import Payment from "../db/models/Payments.js";
import BonusCard from "../db/models/BonusCard.js";
import mongoose from "mongoose";
const bonusPercentage = Number(process.env.BONUS_PERCENTAGE);

// const instruction = '*/10 * * * * *';
const instruction = '0 2 * * *';

cron.schedule(instruction, async () => {
    console.log("Starting midnight job to complete queued medical records...");
    
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (isNaN(bonusPercentage)) throw new Error("Invalid bonus percentage in ENV");

        // Получение всех записей со статусом "queue"
        const records = await PatientMedicalRecord.find({ status: 'queue' });
        console.log(records.length);
        for (const medRecord of records) {
            await PatientMedicalRecord.findByIdAndUpdate(medRecord._id, { $set: { status: 'completed' } }, { session });

            // Удаление записи из очереди сервиса
            const service = await Service.findOneAndUpdate({ _id: medRecord.serviceId },
                { $pull: { currentQueue: medRecord._id } },
                { session }
            );

            // Начисление бонусов, если необходимо
            if (!medRecord.isInpatient) {
                const payment = await Payment.findById(medRecord.paymentRecord);
                if (payment) {
                    const bonusCard = await BonusCard.findOne({ cardId: payment.bonusCardId }, {}, { session });
                    if (bonusCard) {
                        const adjustment = (service.price - payment.bonusDeduction) * bonusPercentage;
                        await BonusCard.findOneAndUpdate({ cardId: payment.bonusCardId },
                            { $inc: { balance: adjustment } },
                            { session }
                        );
                    }
                }
            }
        }

        await session.commitTransaction();
        console.log("Midnight job completed successfully.");
    } catch (error) {
        console.error("Midnight job failed:", error);
        await session.abortTransaction();
    } finally {
        session.endSession();
    }
}, {
  timezone: process.env.TZ
});
