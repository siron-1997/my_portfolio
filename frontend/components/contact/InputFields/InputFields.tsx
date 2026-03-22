import Label from './Label';
import useInputFields from './useInputFields';
import s from '@/styles/contact/InputFields.module.css';

const InputFields = () => {
  const {
    emailErrorMessage,
    isNotNameEmpty,
    isNotEmailValid,
    isNotMessageEmpty,
    isFinishedFirstStep,
    isValidationError,
    isInitialValidationCheck,
    inputNameClassNames,
    inputEmailClassNames,
    inputMessageClassNames,
    handleChangeName,
    handleChangeEmail,
    handleChangeMessage,
  } = useInputFields();

  return (
    <>
      {/* name */}
      <div className={s.input_container}>
        <Label title="name" id="input-name" isFinishedFirstStep={isFinishedFirstStep} />
        <input
          id="input-name"
          name="name"
          type="text"
          readOnly={isFinishedFirstStep}
          className={inputNameClassNames}
          onChange={(e) => handleChangeName(e)}
        />
        {isInitialValidationCheck && isValidationError && !isNotNameEmpty && (
          <div className={s.error}>名前を入力してください。</div>
        )}
      </div>
      {/* email */}
      <div className={s.input_container}>
        <Label
          title="E-mail"
          id="input-email"
          isFinishedFirstStep={isFinishedFirstStep}
        />
        <input
          id="input-email"
          name="email"
          type="email"
          readOnly={isFinishedFirstStep}
          className={inputEmailClassNames}
          onChange={(e) => handleChangeEmail(e)}
        />
        {isInitialValidationCheck &&
          isValidationError &&
          !isNotEmailValid &&
          emailErrorMessage && <div className={s.error}>{emailErrorMessage}</div>}
      </div>
      {/* message */}
      <div className={s.input_container}>
        <Label
          title="Message"
          id="input-textarea"
          isFinishedFirstStep={isFinishedFirstStep}
        />
        <textarea
          id="input-textarea"
          name="message"
          readOnly={isFinishedFirstStep}
          className={inputMessageClassNames}
          onChange={(e) => handleChangeMessage(e)}
        />
        {(isInitialValidationCheck || isValidationError) && !isNotMessageEmpty && (
          <div className={s.error}>メッセージを入力してください。</div>
        )}
      </div>
    </>
  );
};

export default InputFields;
