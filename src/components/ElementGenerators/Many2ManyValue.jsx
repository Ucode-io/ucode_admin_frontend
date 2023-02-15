import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import constructorObjectService from '../../services/constructorObjectService';

function Many2ManyValue({field, value}) {
    
    const { data: options } = useQuery(
        ["GET_OBJECT_LIST", field?.table_slug],
        () => {
          return constructorObjectService.getList(field?.table_slug, {
            data: {
             guid: value
            },
          });
        },
        {
          select: (res) => {
            return res?.data?.response ?? [];
          },
        }
      );
      const computedValue = useMemo(() => {
        let val = '';
        const slugs = field?.view_fields?.map((item) => item?.slug)
         options?.map((item) => {
           return val += slugs?.map((el) => " " +  item?.[el] + ' ')
        })
        return val
      }, [field, options])
    return (
        <div>
            {computedValue}
        </div>
    );
}

export default Many2ManyValue;