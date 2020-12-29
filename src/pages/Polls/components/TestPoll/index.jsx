import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { ExoticHeading } from 'components/layouts';
import { StoresContext } from 'store/mobx';
import style from './style.pcss';

const TestPoll = () => {
  const { Templates } = useContext(StoresContext);
  const {
    title,
    statement1,
    statement2,
    statement3,
    statement4,
    statement5,
    statement6,
    statement7,
    result1,
    result2,
    result3,
    result4,
    result5,
    result6,
    result7,
  } = Templates.getPollsTemplate('TestPoll');
  const {
    header,
    image,
    button,
    file,
  } = Templates.getPollsTemplate('TestChart');

  return (
    <>
      <div className={style.holder}>
        <ExoticHeading level={3} className={style.title}>
          {title}
        </ExoticHeading>
        <div className={style.wrapper}>
          <div className={style.row}>
            <div className={style.firstCell}>
              <span className={style.description}>{statement1}</span>
            </div>
            <div className={style.secondCell}>
              <span className={style.description}>{result1}</span>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.firstCell}>
              <span className={style.description}>{statement2}</span>
            </div>
            <div className={style.secondCell}>
              <span className={style.description}>{result2}</span>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.firstCell}>
              <span className={style.description}>{statement3}</span>
            </div>
            <div className={style.secondCell}>
              <span className={style.description}>{result3}</span>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.firstCell}>
              <span className={style.description}>{statement4}</span>
            </div>
            <div className={style.secondCell}>
              <span className={style.description}>{result4}</span>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.firstCell}>
              <span className={style.description}>{statement5}</span>
            </div>
            <div className={style.secondCell}>
              <span className={style.description}>{result5}</span>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.firstCell}>
              <span className={style.description}>{statement6}</span>
            </div>
            <div className={style.secondCell}>
              <span className={style.description}>{result6}</span>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.firstCell}>
              <span className={style.description}>{statement7}</span>
            </div>
            <div className={style.secondCell}>
              <span className={style.description}>{result7}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={style.whiteHolder}>
        <ExoticHeading level={3} className={style.title}>{header}</ExoticHeading>
        <img
          alt=""
          src={image}
          className={style.reportImage}
        />
        <div className={style.buttonHolder}>
          <a
            rel="noopener noreferrer"
            target="_blank"
            className={style.downloadLink}
            href={file}
          >{button}
          </a>
        </div>
      </div>
    </>
  );
};

export default observer(TestPoll);
