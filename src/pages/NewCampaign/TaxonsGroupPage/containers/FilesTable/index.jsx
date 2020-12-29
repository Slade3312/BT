import React from 'react';
import PropTypes from 'prop-types';
import ExitButton from 'components/common/ExitButton';
import { wordFormByCount } from 'utils/fn';
import { LightText } from 'components/common';
import { Heading } from 'components/layouts';
import FileIcon from 'components/common/FileIcon';
import { formatPureFileName } from 'utils/formatting';
import styles from './styles.pcss';

function FilesTable({ files, onFileRemove, numbersCases, maxCount }) {
  const contactsSumm = files.reduce((prevSum, curItem) => {
    prevSum += curItem.items_count;
    return prevSum;
  }, 0);

  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <th className={styles.headerLabel}>
            <LightText>Название файла</LightText>
          </th>
          <th className={styles.headerLabel}>
            <LightText>Количество объектов в файле</LightText>
          </th>
          <th />
        </tr>

        {files.map((item) => (
          <tr key={item.id}>
            <td className={styles.tableCol}>
              <div className={styles.fileNameCol}>
                <FileIcon className={styles.fileIcon} extension={item.type} />

                <Heading className={styles.fileName} level={5}>{`${formatPureFileName(item.file)}`}</Heading>
              </div>
            </td>
            <td className={styles.tableCol}>
              <Heading level={5}>{item.items_count}{' '}{wordFormByCount(item.items_count, numbersCases)}</Heading>
            </td>
            <td className={styles.tableCol}>
              <ExitButton
                className={styles.removeButton}
                onClick={() => onFileRemove(item.id)}
            />
            </td>
          </tr>
      ))}

        <tr>
          <td />
          <td className={styles.bottomCol}>
            {maxCount < contactsSumm && (
            <Heading level={5} className={styles.error}>
              Мы можем проанализировать только {maxCount}{' '}{wordFormByCount(maxCount, numbersCases)} из загруженных
            </Heading>
          )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

FilesTable.propTypes = {
  files: PropTypes.array,
  onFileRemove: PropTypes.func,
  numbersCases: PropTypes.array,
  maxCount: PropTypes.string,
};

export default FilesTable;
