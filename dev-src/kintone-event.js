(() => {
  'use strict';

  const toiawaseAppId = 1613;

  // レコード作成、編集画面表示イベント
  kintone.events.on(['app.record.create.show', 'app.record.edit.show'], (event) => {
    // すでにボタンがあれば追加しない
    if (document.getElementById('entry_button')) return;

    // ボタンを作成
    const entry_button = document.createElement('button');
    entry_button.id = 'entry_button';
    entry_button.classList.add('kintoneplugin-button-normal');
    entry_button.innerText = '一覧登録';
    entry_button.style.marginLeft = '10px';

    // イベント処理を追加
    entry_button.onclick = function() {
      const record = kintone.app.record.get();

      // 追加する行データ
      const newRow = {
        value: {
          明細_見積結果: {
            value: record.record['見積結果_1'].value,
            type: record.record['明細'].value[0].value.明細_見積結果.type
          },
          明細_部品_大分類: {
            value: record.record['部品_大分類'].value,
            type: record.record['明細'].value[0].value.明細_部品_大分類.type
          },
          明細_中分類: {
            value: record.record['中分類'].value,
            type: record.record['明細'].value[0].value.明細_中分類.type
          },
          明細_部品名: {
            value: record.record['部品名'].value,
            type: record.record['明細'].value[0].value.明細_部品名.type
          },
          部品状態_0: {
            value: record.record['部品状態'].value,
            type: record.record['明細'].value[0].value.部品状態_0.type
          },
          明細_仕入先: {
            value: record.record['仕入先'].value,
            type: record.record['明細'].value[0].value.明細_仕入先.type
          },
          明細_見積金額: {
            value: record.record['見積金額'].value,
            type: record.record['明細'].value[0].value.明細_見積金額.type
          },
          明細_仕入金額: {
            value: record.record['仕入金額'].value,
            type: record.record['明細'].value[0].value.明細_仕入金額.type
          },
          明細_送料: {
            value: record.record['送料_0'].value,
            type: record.record['明細'].value[0].value.明細_送料.type
          },
          明細_粗利額: {
            type: record.record['明細'].value[0].value.明細_粗利額.type
          },
          明細_粗利率: {
            type: record.record['明細'].value[0].value.明細_粗利率.type
          },
          明細_部品CD: {
            value: record.record['部品CD'].value,
            type: record.record['明細'].value[0].value.明細_部品CD.type
          },
          受注日_0: {
            value: undefined,
            type: record.record['明細'].value[0].value.受注日_0.type
          },
          削除FLG: {
            value: [],
            type: record.record['明細'].value[0].value.削除FLG.type
          },
          件数: {
            value: undefined,
            type: record.record['明細'].value[0].value.件数.type
          }
        }
      };

      // 行を追加
      if (record.record['明細'].value[0].value.明細_中分類.value === undefined &&
            record.record['明細'].value[0].value.明細_部品名.value === undefined &&
            record.record['明細'].value[0].value.部品状態_0.value === undefined &&
            record.record['明細'].value[0].value.明細_仕入先.value === undefined &&
            record.record['明細'].value[0].value.明細_見積金額.value === undefined &&
            record.record['明細'].value[0].value.明細_仕入金額.value === undefined &&
            record.record['明細'].value[0].value.明細_送料.value === undefined &&
            record.record['明細'].value[0].value.明細_部品CD.value === undefined
      ) {
        record.record['明細'].value[0] = newRow;
      } else {
        record.record['明細'].value.push(newRow);
      }


      // クリア処理
      record.record.見積結果_1.value = undefined;
      record.record.部品_大分類.value = undefined;
      record.record.部品名.value = undefined;
      record.record.部品状態.value = undefined;
      record.record.中分類.value = undefined;
      record.record.部品CD.value = undefined;
      record.record.仕入先.value = undefined;
      record.record.見積金額.value = undefined;
      record.record.仕入金額.value = undefined;
      record.record.送料_0.value = undefined;

      // 反映
      kintone.app.record.set(record);
    };

    // スペースにボタンを追加
    const space_field = kintone.app.record.getSpaceElement('space_entry');
    space_field.appendChild(entry_button);

  });

  // レコード作成、編集画面表示イベント
  kintone.events.on(['app.record.create.submit.success', 'app.record.edit.submit.success'], async (event) => {
    const record = event.record;

    // 現在開いているレコードの情報を取得
    const meisai = record.明細.value;
    const serialNumber = record.問合・販売番号.value;

    const allRecords = [];

    for (let i = 0; i < meisai.length; i++) {
      const data = meisai[i].value;
      const newSerialNumber = serialNumber + '-' + genBranch(i + 1);

      allRecords.push({
        updateKey: {
          field: '問合・販売枝番',
          value: newSerialNumber
        },
        record: {
          お客様検索: {value: record.お客様検索.value},
          取引先コード: {value: record.取引先コード.value},
          取引先名１: {value: record.取引先名１.value},
          取引先名カナ: {value: record.取引先名カナ.value},
          文字列__1行_: {value: record.文字列__1行_.value},
          略称: {value: record.略称.value},
          分類: {value: record.分類.value},
          取引先名２: {value: record.取引先名２.value},
          データ入力日: {value: record.データ入力日.value},
          日付: {value: record.日付.value},
          郵便番号: {value: record.郵便番号.value},
          住所1: {value: record.住所1.value},
          住所2: {value: record.住所2.value},
          住所3: {value: record.住所3.value},
          電話番号2: {value: record.電話番号2.value},
          FAX番号1: {value: record.FAX番号1.value},
          備考: {value: record.備考.value},
          入金予定: {value: record.入金予定.value},
          入金予定日: {value: record.入金予定日.value},
          売掛締日: {value: record.売掛締日.value},
          入金方法: {value: record.入金方法.value},
          支払予定: {value: record.支払予定.value},
          支払予定日: {value: record.支払予定日.value},
          買掛締日: {value: record.買掛締日.value},
          支払方法: {value: record.支払方法.value},
          登録番号: {value: record.登録番号.value},
          電話番号1: {value: record.電話番号1.value},
          問い合わせ媒体: {value: record.問い合わせ媒体.value},
          見積結果: {value: data.明細_見積結果.value},
          ドロップダウン: {value: record.ドロップダウン.value},
          車種: {value: record.車種.value},
          車名: {value: record.車名.value},
          型式: {value: record.型式.value},
          類型: {value: record.類型.value},
          年式: {value: record.年式.value},
          カラー: {value: record.カラー.value},
          エンジン: {value: record.エンジン.value},
          お問合せ内容詳細: {value: record.お問合せ内容詳細.value},
          ユニコ見積担当: {value: record.ユニコ見積担当.value},
          見積提示日: {value: record.見積提示日.value},
          保証期限: {value: record.保証期限.value},
          見積媒体: {value: record.見積媒体.value},
          管理番号: {value: record.管理番号.value},
          仕入先_0: {value: record.仕入先_0.value},
          部品_大分類: {value: data.明細_部品_大分類.value},
          受注日: {value: data.受注日_0.value},
          中分類: {value: data.明細_中分類.value},
          部品名: {value: data.明細_部品名.value},
          部品状態: {value: data.部品状態_0.value},
          見積金額: {value: data.明細_見積金額.value},
          仕入金額: {value: data.明細_仕入金額.value},
          送料: {value: data.明細_送料.value},
          仕入先: {value: data.明細_仕入先.value},
          集計対象: {value: data.削除FLG.value}
        }
      });
    }

    // レコードが存在しない場合はスキップ
    if (allRecords.length === 0) {
      return event;
    }

    // 100件ずつ分割
    const chunkArray = (array, size) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    const chunks = chunkArray(allRecords, 100);

    try {
      for (const chunk of chunks) {
        const body = {
          app: toiawaseAppId,
          upsert: true,
          records: chunk
        };
        await kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', body);
      }
      console.log('すべてのレコードが正常に更新されました');
      return event;
    } catch (error) {
      console.error('更新エラー:', error);
      event.error = '明細情報の保存中にエラーが発生しました。';
      return event;
    }
  });

  // 枝番を作成する関数
  function genBranch(number) {
    if (number < 10) {
      return `0${number}`;
    }
    return String(number);

  }
})();