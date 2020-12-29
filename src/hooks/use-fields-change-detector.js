import { useContext, useEffect, useMemo, useState } from 'react';
import { useFormState } from 'react-final-form';
import { isDeepEqual } from 'utils/isDeepEqual';
import { StoresContext } from 'store/mobx';

// usually used for reset promocode data cause of promocode depend on calculated events, and user must check promocode again manually
export const useFieldChangeDetector = (onAnyRegisteredFieldChange) => {
  const { modified, values } = useFormState();
  const { NewCampaign } = useContext(StoresContext);

  const modifiedValuesMap = useMemo(() => {
    const res = {};

    Object.keys(modified).forEach(key => {
      if (modified[key]) {
        let fieldKey = key;
        // for field array fields
        if (key.includes('.')) {
          fieldKey = key.split('.')[0];
        }
        res[fieldKey] = values[fieldKey];
      }
    });

    return res;
  }, [modified, values]);

  const [prevValues, setValues] = useState(modifiedValuesMap);

  useEffect(() => {
    if (NewCampaign.isCampaignInDraft && !isDeepEqual(prevValues, modifiedValuesMap)) {
      onAnyRegisteredFieldChange(values);
      setValues(modifiedValuesMap);
    }
  }, [values]);
};
