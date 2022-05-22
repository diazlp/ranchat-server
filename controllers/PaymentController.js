const { Payment, User } = require("../models");
const snap = require("../services/midtrans");

class PaymentController {
  static async payment(req, res, next) {
    try {
      const { error } = req.body;
      if (error) {
        throw err;
      }

      let parameter = {
        transaction_details: {
          order_id: "RanChat_" + Math.floor(Math.random() * 1000000),
          gross_amount: 50000,
        },
        customer_details: {
          first_name: req.user?.fullName.split(" ")[0],
          last_name: req.user?.fullName.split(" ")[1],
          email: req.user?.email,
          phone: "+6281283071034",
        },
        enabled_payments: [
          "credit_card",
          "cimb_clicks",
          "bca_klikbca",
          "bca_klikpay",
          "bri_epay",
          "echannel",
          "permata_va",
          "bca_va",
          "bni_va",
          "bri_va",
          "other_va",
          "gopay",
          "indomaret",
          "danamon_online",
          "akulaku",
          "shopeepay",
        ],
        credit_card: {
          secure: true,
          channel: "migs",
          bank: "bca",
          installment: {
            required: false,
            terms: {
              bni: [3, 6, 12],
              mandiri: [3, 6, 12],
              cimb: [3],
              bca: [3, 6, 12],
              offline: [6, 12],
            },
          },
          whitelist_bins: ["48111111", "41111111"],
        },
      };

      const transaction = await snap.createTransaction(parameter);

      await Payment.create({
        UserId: req.user.id,
        checkoutDate: new Date(),
      });

      await User.update(
        { isPremium: true },
        {
          where: {
            id: req.user?.id,
          },
        }
      );

      // kayaknya disini ada yang kurang sempurna, kurang paymentStatus
      res.status(200).json({
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
