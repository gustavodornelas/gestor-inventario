import { parseISO } from 'date-fns';

export const converterData = (dataString) => {
    if (dataString) {
        const dataObj = parseISO(dataString);
        return new Date(dataObj);
    }
    return null;
};

export const alterarInput = (formData, setFormData, e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

export const alterarData = (formData, setFormData, date, name) => {
    setFormData({ ...formData, [name]: date });
};
