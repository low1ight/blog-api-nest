import { UserDocument } from '../../../../users/entities/user.entity';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { UsersRepository } from '../../../../users/repositories/Users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class ConfirmEmailUseCaseCommand {
  constructor(public code: string) {}
}
@CommandHandler(ConfirmEmailUseCaseCommand)
export class ConfirmEmailUseCase
  implements ICommandHandler<ConfirmEmailUseCaseCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute({ code }: ConfirmEmailUseCaseCommand) {
    const user: UserDocument | null =
      await this.usersRepository.getUserByConfirmationCode(code);

    if (!user)
      return new CustomResponse(
        false,
        CustomResponseEnum.badRequest,
        `incorrect confirmation code`,
      );

    //check is email can be confirmed and return custom response
    const response: CustomResponse<any> = user.isEmailCanBeConfirmed();

    if (!response.isSuccess) return response;

    user.confirmEmail();

    await this.usersRepository.save(user);

    return new CustomResponse(true);
  }
}
