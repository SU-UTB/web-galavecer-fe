import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../../api';
import useFetchFaculties from '../../hooks/useFetchFaculties';
import { IFormNominationData } from '../../lib/interfaces/IFormNominationData';
import {
  StyledForm,
  StyledFormGroup,
  StyledFormRow,
  StyledInput,
  StyledSelect,
  StyledSubmitButton,
  StyledTextarea,
} from './Form.styled';

const INITIAL_DATA: IFormNominationData = {
  firstName: '',
  lastName: '',
  email: '',
  facultyNominated: null,
  firstNameNominated: '',
  lastNameNominated: '',
  achievementsNominated: '',
};

const FormNomination = () => {
  const [data, setData] = useState<IFormNominationData>(INITIAL_DATA);
  const { data: faculties } = useFetchFaculties();
  const [sendingForm, setSendingForm] = useState<boolean>(false);

  const updateFields = (fields: Partial<IFormNominationData>) => {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSendingForm(true);
      const response = await api.post('nominations', data);
      if (response.status === 200) {
        toast.success('Formulář úspěšně odeslán.');
        setData(INITIAL_DATA);
      }
    } catch (err) {
      toast.error('Stala se chyba');
    } finally {
      setSendingForm(false);
    }
  };

  return (
    <StyledForm onSubmit={submitForm}>
      <StyledFormGroup>
        <StyledFormRow>
          <StyledInput
            type="text"
            name="firstNameNominated"
            placeholder="Jméno nominovaného"
            required
            value={data.firstNameNominated}
            onChange={(e) =>
              updateFields({ firstNameNominated: e.target.value })
            }
          />
          <StyledInput
            type="text"
            name="lastNameNominated"
            placeholder="Příjmení nominovaného"
            required
            value={data.lastNameNominated}
            onChange={(e) =>
              updateFields({ lastNameNominated: e.target.value })
            }
          />
        </StyledFormRow>
        <StyledFormRow>
          <StyledSelect
            name="facultyNominated"
            id="facultyNominated"
            required
            value={data.facultyNominated ?? ''}
            onChange={(e) =>
              updateFields({ facultyNominated: Number(e.target.value) })
            }
          >
            <option disabled value="">
              Fakulta nominovaného
            </option>
            {faculties?.map(({ id, faculty_name, faculty_abbrev }) => (
              <option key={id} value={id}>
                {faculty_abbrev} - {faculty_name}
              </option>
            ))}
          </StyledSelect>
        </StyledFormRow>
        <StyledFormRow>
          <StyledTextarea
            name="achievementsNominated"
            id="achievementsNominated"
            placeholder="Důvod k nominaci"
            required
            value={data.achievementsNominated}
            onChange={(e) =>
              updateFields({ achievementsNominated: e.target.value })
            }
          ></StyledTextarea>
        </StyledFormRow>
      </StyledFormGroup>
      <StyledFormGroup>
        <StyledFormRow>
          <StyledInput
            type="text"
            placeholder="Jméno"
            name="firstName"
            id="firstName"
            required
            value={data.firstName}
            onChange={(e) => updateFields({ firstName: e.target.value })}
          />
          <StyledInput
            type="text"
            placeholder="Příjmení"
            name="lastName"
            id="lastName"
            required
            value={data.lastName}
            onChange={(e) => updateFields({ lastName: e.target.value })}
          />
        </StyledFormRow>
        <StyledFormRow>
          <StyledInput
            type="email"
            name="email"
            id="email"
            placeholder="Univerzitní e-mail"
            pattern=".+@utb\.cz"
            title="Prosím, použijte univerznitní mail @utb.cz"
            required
            value={data.email}
            onChange={(e) => updateFields({ email: e.target.value })}
          />
        </StyledFormRow>
      </StyledFormGroup>
      <StyledSubmitButton type="submit">Nominovat</StyledSubmitButton>
    </StyledForm>
  );
};

export default FormNomination;
