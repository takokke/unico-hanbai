(() => {
    'use strict';

    // レコード作成、編集画面表示イベント
    kintone.events.on(['app.record.create.show', 'app.record.edit.show'], function (event) {
        // すでにボタンがあれば追加しない
        if (document.getElementById('entry_button')) return;

        // ボタンを作成
        let entry_button = document.createElement('button');
        entry_button.id = 'entry_button';
        entry_button.classList.add('kintoneplugin-button-normal');
        entry_button.innerText = '一覧登録';
        entry_button.style.marginLeft = '10px';

        // イベント処理を追加
        entry_button.onclick = function () {
            let record = kintone.app.record.get();

            // 追加する行データ
            let newRow = {
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

        return event;
    });

    // レコード作成、編集画面表示イベント
    kintone.events.on(['app.record.create.submit.success', 'app.record.edit.submit.success'], async (event) => {
      const record = event.record;
  
      const meisai = record.明細.value;
      const client = new KintoneRestAPIClient();
   
      const body1 = {
        app: 75, // 部品状態_0 のアプリID
        upsert: true,
        records: []
      };
      const body2 = {
        app: 76, // 明細_仕入先 のアプリID
        upsert: true,
        records: []
      };

      for (const row of meisai) {
        const data = row.value;
        
        if (data.部品状態_0.value) {
          body1.records.push({
            updateKey: {
              field: '部品詳細',
              value: data.部品状態_0.value
            },
            record: {}
          }); 
        }
        
        if (data.明細_仕入先.value) { 
          body2.records.push({
            updateKey: {
              field: '仕入先',
              value: data.明細_仕入先.value
            },
            record: {}
          });
        }
      }
      
      try {
        console.log(body1)
        console.log(body2)
        if (body1.records.length !== 0 ) {
          await client.record.updateAllRecords(body1);
        }
        if (body2.records.length !== 0 ) {
          await client.record.updateAllRecords(body2);
        }
        console.log("明細情報をマスタに保存しました")
      } catch (error) {
        console.error('アップサートエラー:', error);
        event.error = '明細情報の保存中にエラーが発生しました。';
        return event;
      }
      
      return event;
    });

})();