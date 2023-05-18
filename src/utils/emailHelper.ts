export class EmailHelper {
  static setNewConfirmationCodeDate() {
    return new Date(
      Date.now() +
        1000 * 60 * +process.env.MIN_TO_EXPIRE_EMAIL_CONFIRMATION_CODE,
    );
  }
}
