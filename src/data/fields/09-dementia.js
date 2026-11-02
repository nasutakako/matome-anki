/* 認知症の理解 */
defineField({
  id: "dementia",
  name: "認知症の理解",
  description: "症状・原因疾患・ケアの考え方・制度",
  themes: [
    {
      id: "dementia-basics",
      name: "認知症の基礎知識",
      summary: "定義・MCI・若年性認知症・検査・せん妄とうつ病",
      pages: [
        {
          id: "definition",
          title: "認知症の基本と検査",
          lead: "定義・関連する状態・代表的な検査",
          terms: [
            {
              id: "dementia-basics.definition.dementia",
              term: "認知症",
              reading: "にんちしょう",
              definition: "いったん正常に発達した認知機能が、後天的な脳の障害によって持続的に低下し、日常生活や社会生活に支障をきたしている状態。",
              point: "「後天的」「持続的に低下」「生活に支障」がキーワード。生まれつきの知的障害とは区別される。"
            },
            {
              id: "dementia-basics.definition.aging",
              term: "加齢によるもの忘れ",
              reading: "かれいによるものわすれ",
              definition: "体験の一部を忘れるもの忘れ。本人に自覚があり、ヒントで思い出せることが多く、ほとんど進行せず生活に大きな支障はない。",
              point: "認知症のもの忘れは「体験全体を忘れる」「自覚に乏しい」「進行する」「生活に支障がある」。",
              example: "朝食に何を食べたか思い出せない（加齢）／朝食を食べたこと自体を忘れる（認知症）。"
            },
            {
              id: "dementia-basics.definition.mci",
              term: "軽度認知障害（MCI）",
              reading: "けいどにんちしょうがい",
              definition: "記憶などの認知機能の低下があるが、日常生活はおおむね自立しており、認知症とはいえない状態。",
              point: "認知症の前段階とされる。一部は認知症へ移行するが、正常な状態に戻る人もいる。"
            },
            {
              id: "dementia-basics.definition.young",
              term: "若年性認知症",
              reading: "じゃくねんせいにんちしょう",
              definition: "65歳未満で発症した認知症。働き盛りで発症することが多く、就労や経済面、子育てなどの問題が生じやすい。配偶者が介護者になることが多い。",
              point: "「65歳未満で発症」。原因疾患はアルツハイマー型が最も多い。介護保険は40歳から利用できる（特定疾病）。"
            },
            {
              id: "dementia-assessment.scales.hdsr",
              term: "HDS-R",
              reading: "改訂長谷川式簡易知能評価スケール",
              definition: "年齢、日時や場所の見当識、言葉の記憶、計算、数字の逆唱などを質問して評価する。",
              point: "9項目・30点満点で、20点以下は認知症の疑い。長谷川和夫が開発。"
            },
            {
              id: "dementia-assessment.scales.mmse",
              term: "MMSE",
              reading: "ミニメンタルステート検査",
              definition: "見当識、記憶、計算などの質問に加え、図形の模写や文章を書くなどの動作も含めて評価する。",
              point: "30点満点で、23点以下は認知症の疑い。国際的に広く使われている。"
            }
          ]
        },
        {
          id: "differential",
          title: "認知症と区別したい状態",
          lead: "認知症と間違えやすいが、原因や経過が異なる",
          terms: [
            {
              id: "dementia-basics.differential.delirium",
              term: "せん妄",
              reading: "せんもう",
              definition: "軽い意識障害を背景に、注意力の低下、幻覚、興奮などが急に現れる状態。脱水、発熱、感染症、薬の副作用、手術、環境の変化などが原因となる。",
              point: "認知症との違いは「急に発症」「意識障害がある」「1日の中で症状が変動する」。夕方〜夜間に起こりやすい（夜間せん妄）。原因を取り除くと改善することが多い。"
            },
            {
              id: "dementia-basics.differential.depression",
              term: "老年期うつ病",
              reading: "ろうねんきうつびょう",
              definition: "高齢期に起こるうつ病。気分の落ち込みや意欲の低下に加え、頭痛・食欲不振・不眠など体の不調を強く訴えることが多い。",
              point: "自殺の危険に注意する。安易に励まさず、話を受け止めて休養を促す。"
            },
            {
              id: "dementia-basics.differential.pseudo",
              term: "仮性認知症",
              reading: "かせいにんちしょう",
              definition: "うつ病などにより、認知機能が低下して認知症のようにみえる状態。うつ病の治療によって改善が期待できる。",
              point: "本人がもの忘れを自覚し、強く訴えるのが特徴。認知症では自覚に乏しいことが多い。"
            }
          ]
        }
      ]
    },
    {
      id: "dementia-symptoms",
      name: "認知症の主な症状",
      summary: "中核症状と行動・心理症状（BPSD）",
      pages: [
        {
          id: "core",
          title: "中核症状",
          lead: "脳の障害によって直接起こり、多くの人にみられる症状",
          terms: [
            {
              id: "dementia-symptoms.core.memory",
              term: "記憶障害",
              reading: "きおくしょうがい",
              definition: "新しいことを覚えられなくなる障害。最近の出来事の記憶（近時記憶）から失われやすく、体験したこと自体を忘れてしまう。",
              point: "昔の記憶（遠隔記憶）は比較的保たれる。",
              example: "食事をしたこと自体を忘れ、「まだ食べていない」と言う。"
            },
            {
              id: "dementia-symptoms.core.orientation",
              term: "見当識障害",
              reading: "けんとうしきしょうがい",
              definition: "時間・場所・人物がわからなくなる障害。",
              point: "「時間 → 場所 → 人物」の順に障害されやすい。",
              example: "季節に合わない服を着る。自宅にいるのに「家に帰る」と言う。"
            },
            {
              id: "dementia-symptoms.core.judgment",
              term: "理解・判断力の障害",
              reading: "りかい・はんだんりょくのしょうがい",
              definition: "考える速さが落ち、物事を理解したり、状況に合った判断をしたりすることが難しくなる。",
              point: "2つ以上のことが重なると処理できない。いつもと違う出来事で混乱しやすい。"
            },
            {
              id: "dementia-symptoms.core.executive",
              term: "実行機能障害",
              reading: "じっこうきのうしょうがい",
              definition: "計画を立て、手順どおりに物事を進めることができなくなる障害。",
              example: "料理の段取りがわからず、手順どおりに作れない。"
            },
            {
              id: "dementia-symptoms.core.attention",
              term: "注意障害",
              reading: "ちゅういしょうがい",
              definition: "注意を集中したり、続けたり、複数のことに同時に注意を向けたりすることが難しくなる障害。",
              point: "周りの音や動きに気を取られやすい。食事中に手が止まる、作業を途中でやめてしまうなどがみられる。"
            },
            {
              id: "dementia-symptoms.core.aphasia",
              term: "失語",
              reading: "しつご",
              definition: "話す・聞いて理解する・読む・書くといった言葉の働きが障害される。",
              point: "発声器官（口・のど）の障害ではない。",
              example: "物の名前が出てこない。言われたことが理解できない。"
            },
            {
              id: "dementia-symptoms.core.apraxia",
              term: "失行",
              reading: "しっこう",
              definition: "手足の運動機能に問題がないのに、目的に沿った動作ができなくなる。",
              example: "服の着方がわからない（着衣失行）。"
            },
            {
              id: "dementia-symptoms.core.agnosia",
              term: "失認",
              reading: "しつにん",
              definition: "視覚や聴覚などの感覚に問題がないのに、見たもの・聞いたものなどが何かを認識できなくなる。",
              example: "家族の顔を見ても誰かわからない（相貌失認）。"
            }
          ]
        },
        {
          id: "bpsd",
          title: "行動・心理症状（BPSD）",
          lead: "中核症状に、性格・環境・体調・人間関係が影響して現れる",
          terms: [
            {
              id: "dementia-symptoms.bpsd.wandering",
              term: "徘徊",
              reading: "はいかい",
              definition: "道に迷うなどして歩き回ること。本人なりの目的や理由があることが多い。",
              point: "近年は「ひとり歩き」とも表現される。理由を理解しようとすることが対応の基本。"
            },
            {
              id: "dementia-symptoms.bpsd.theft-delusion",
              term: "物盗られ妄想",
              reading: "ものとられもうそう",
              definition: "しまった場所を忘れ、「盗まれた」と思い込むこと。身近な介護者が疑われやすい。",
              point: "アルツハイマー型認知症の初期に多い。"
            },
            {
              id: "dementia-symptoms.bpsd.hallucination",
              term: "幻覚",
              reading: "げんかく",
              definition: "実際にはないものを、あるように感じること。見える（幻視）、聞こえる（幻聴）などがある。",
              point: "ありありとした幻視はレビー小体型認知症に特徴的。"
            },
            {
              id: "dementia-symptoms.bpsd.sundowning",
              term: "夕暮れ症候群",
              reading: "ゆうぐれしょうこうぐん",
              definition: "夕方になると落ち着かなくなり、「家に帰る」と言って出て行こうとするなどの行動がみられること。",
              point: "帰宅願望として現れることが多い。"
            },
            {
              id: "dementia-symptoms.bpsd.aggression",
              term: "暴言・暴力",
              reading: "ぼうげん・ぼうりょく",
              definition: "大声で怒鳴る、たたくなどの行動。不安や不快、思いをうまく伝えられないことが背景にある。"
            },
            {
              id: "dementia-symptoms.bpsd.resistance",
              term: "介護への抵抗",
              reading: "かいごへのていこう",
              definition: "入浴や着替えなどの介護を拒むこと。状況が理解できない不安や羞恥心が背景にあることが多い。"
            },
            {
              id: "dementia-symptoms.bpsd.depression",
              term: "抑うつ",
              reading: "よくうつ",
              definition: "気分が落ち込み、意欲や活動性が低下した状態。認知症の初期にもよくみられる。"
            },
            {
              id: "dementia-symptoms.bpsd.pica",
              term: "異食",
              reading: "いしょく",
              definition: "食べ物ではないものを口に入れたり、食べたりすること。",
              point: "誤飲・窒息の危険があるため、手の届く所に危険な物を置かない。"
            }
          ]
        },
        {
          title: "そのほかの症状と評価",
          lead: "BPSDの種類と、生活の自立度",
          terms: [
            ["アパシー", "無気力", "意欲や関心、感情の動きが低下した状態。", "本人は苦痛を感じていないことが多い点が、抑うつとの違い。"],
            ["妄想の種類", "", "物盗られ妄想、嫉妬妄想（配偶者の浮気を疑う）、心気妄想（重い病気だと思い込む）、被害妄想など。", ""],
            ["認知症の危険因子", "", "高血圧、糖尿病、喫煙、運動不足、難聴、社会的な孤立、歯の喪失による咀嚼機能の低下など。", "生活習慣の改善や社会参加が予防につながる。"],
            ["認知症高齢者の日常生活自立度", "", "認知症による生活への支障の程度を、Ⅰ・Ⅱ・Ⅲ・Ⅳ・Mの段階で示したもの。", "Ⅲは日常生活に支障がある症状が時々みられ、介護が必要な状態（aは日中、bは夜間が中心）。Mは専門医療が必要。"],
            ["本人ミーティング", "", "認知症の本人同士が集まり、体験や希望を語り合い、地域に発信する取り組み。", ""],
            ["若年性認知症支援コーディネーター", "", "若年性認知症の人や家族の相談に応じ、就労の継続や社会参加などを支援する。", "都道府県に配置される。"],
          ],
        }
      ]
    },
    {
      id: "dementia-causes",
      name: "認知症の原因疾患",
      summary: "四大認知症・慢性硬膜下血腫・正常圧水頭症",
      pages: [
        {
          id: "main",
          title: "主な原因疾患",
          lead: "四大認知症と、手術で改善が期待できる2つ",
          terms: [
            {
              id: "dementia-causes.main.alzheimer",
              term: "アルツハイマー型認知症",
              reading: "あるつはいまーがたにんちしょう",
              definition: "原因疾患として最も多い。脳の神経細胞が減り、海馬を中心に脳が萎縮する。記憶障害から始まり、ゆっくり進行する。",
              point: "女性に多い。物盗られ妄想、取り繕い（できないことをごまかす）がみられる。"
            },
            {
              id: "dementia-causes.main.vascular",
              term: "血管性認知症",
              reading: "けっかんせいにんちしょう",
              definition: "脳梗塞や脳出血などの脳血管障害が原因。障害された部位によって、できることとできないことが混在する（まだら認知症）。",
              point: "男性に多い。段階的に悪化する。感情失禁（感情のコントロールが難しい）がみられる。高血圧などの生活習慣病が危険因子。"
            },
            {
              id: "dementia-causes.main.lewy",
              term: "レビー小体型認知症",
              reading: "れびーしょうたいがたにんちしょう",
              definition: "レビー小体という物質が脳にたまって起こる。ありありとした幻視、パーキンソン症状、認知機能の日内変動が特徴。",
              point: "レム睡眠行動障害、起立性低血圧などの自律神経症状もみられる。歩行が不安定で転倒に注意。"
            },
            {
              id: "dementia-causes.main.ftd",
              term: "前頭側頭型認知症",
              reading: "ぜんとうそくとうがたにんちしょう",
              definition: "前頭葉・側頭葉の萎縮による。人格の変化、社会のルールを守れない行動（脱抑制）、同じ行動を繰り返す常同行動が特徴。",
              point: "初期は記憶が比較的保たれる。若年での発症が多い。ピック病を含む。",
              example: "毎日同じ時間に同じ道を歩く（周遊）。店の物を持ち帰ってしまう。"
            },
            {
              id: "dementia-causes.others.subdural",
              term: "慢性硬膜下血腫",
              reading: "まんせいこうまくかけっしゅ",
              definition: "頭を打った後、数週間から数か月かけて頭蓋骨の内側（硬膜の下）に血液がたまり、脳を圧迫する。もの忘れ、意欲低下、歩行障害などが現れる。",
              point: "手術で血腫を取り除くと改善が期待できる。軽い打撲でも起こるため、転倒歴の確認が大切。"
            },
            {
              id: "dementia-causes.others.nph",
              term: "正常圧水頭症",
              reading: "せいじょうあつすいとうしょう",
              definition: "脳脊髄液が脳室にたまり、脳を圧迫して起こる。",
              point: "三大症状は「歩行障害」「認知機能障害」「尿失禁」。シャント手術で改善が期待できる。"
            }
          ]
        }
      ]
    },
    {
      id: "dementia-care-theory",
      name: "認知症ケアの考え方",
      summary: "パーソン・センタード・ケアと代表的な技法",
      pages: [
        {
          id: "main",
          title: "ケアの考え方と技法",
          lead: "技法と提唱者をセットで覚える",
          terms: [
            {
              id: "dementia-care-theory.people.kitwood",
              term: "トム・キットウッド",
              reading: "Tom Kitwood",
              definition: "イギリスの心理学者。認知症の人を一人の「人」として尊重する「パーソン・センタード・ケア」を提唱した。",
              point: "パーソン・センタード・ケア／認知症ケアマッピング（DCM）",
              profile: "イギリス・心理学者"
            },
            {
              id: "dementia-care-theory.pcc.pcc",
              term: "パーソン・センタード・ケア",
              reading: "Person-Centred Care",
              definition: "認知症の人を一人の「人」として尊重し、その人の視点に立ってケアを行う考え方。",
              point: "提唱者はトム・キットウッド。病気ではなく「その人」を中心に考える。",
              person: "トム・キットウッド"
            },
            {
              id: "dementia-care-theory.pcc.dcm",
              term: "認知症ケアマッピング（DCM）",
              reading: "Dementia Care Mapping",
              definition: "認知症の人を一定時間観察し、行動や「よい状態・よくない状態」を記録して、ケアの質の改善に役立てる評価法。",
              point: "パーソン・センタード・ケアを実践するための手法。",
              person: "トム・キットウッドら"
            },
            {
              id: "dementia-care-theory.approaches.validation",
              term: "バリデーション",
              reading: "Validation",
              definition: "認知症の人の言動には意味があると考え、否定や訂正をせず、その感情に共感して受け入れるコミュニケーション法。",
              point: "技法：リフレージング（言葉を繰り返す）、ミラーリング（動きや感情を合わせる）、レミニシング（思い出話）、タッチング。",
              person: "ナオミ・フェイル"
            },
            {
              id: "dementia-care-theory.approaches.humanitude",
              term: "ユマニチュード",
              reading: "Humanitude",
              definition: "「あなたを大切に思っている」ことを相手に伝えるためのケア技法。",
              point: "4つの柱は「見る・話す・触れる・立つ」。正面から、同じ高さで、近くで見る。",
              person: "イヴ・ジネスト／ロゼット・マレスコッティ"
            },
            {
              id: "dementia-care-theory.approaches.reminiscence",
              term: "回想法",
              reading: "かいそうほう",
              definition: "昔の思い出を語ってもらい、それを受け止めて聴くことで、心の安定や自信の回復を図る方法。",
              point: "個人回想法とグループ回想法がある。",
              person: "ロバート・バトラー"
            },
            {
              id: "dementia-care-theory.approaches.ro",
              term: "リアリティ・オリエンテーション",
              reading: "現実見当識訓練（RO）",
              definition: "日付・場所・人物などの情報を繰り返し伝え、見当識を補う方法。",
              point: "日常のかかわりの中で行う「24時間RO」と、少人数のグループで行う「クラスルームRO」がある。"
            }
          ]
        }
      ]
    },
    {
      id: "dementia-care",
      name: "認知症の人へのかかわり",
      summary: "生活の場での対応と家族への支援",
      pages: [
        {
          id: "daily",
          title: "生活の場と家族への支援",
          lead: "本人の安心と、介護する家族の負担軽減",
          terms: [
            {
              id: "dementia-care.daily.communication",
              term: "コミュニケーションの基本",
              reading: "",
              definition: "正面から目線を合わせ、ゆっくり、短い言葉で伝える。一度に伝えるのは一つ。言動を否定しない。",
              point: "説得・訂正・叱責は不安を強める。表情など非言語の伝え方も大切。"
            },
            {
              id: "dementia-care.daily.familiar",
              term: "なじみの関係・なじみの環境",
              reading: "",
              definition: "顔なじみの人や、使い慣れた家具・生活用品は安心感を与える。",
              point: "担当者や居室をむやみに変えない。自宅で使っていた物を持ち込む。"
            },
            {
              id: "dementia-care.daily.relocation",
              term: "リロケーションダメージ",
              reading: "",
              definition: "住み慣れた環境から急に移ることで、混乱や不安が強まり、BPSDが悪化すること。",
              point: "入所時は、なじみの物を持ち込み変化を小さくする。"
            },
            {
              id: "dementia-care.daily.theft",
              term: "物盗られ妄想への対応",
              reading: "",
              definition: "否定や説得はせず、本人の困っている気持ちを受け止めて一緒に探す。",
              point: "本人が自分で見つけられるよう、さりげなく促す。"
            },
            {
              id: "dementia-care.daily.homing",
              term: "帰宅願望への対応",
              reading: "",
              definition: "「帰りたい」気持ちを否定せず、理由を聴く。一緒に歩くなど、落ち着くまで寄り添う。",
              point: "無理に引き止めたり、ごまかしたりしない。"
            },
            {
              id: "dementia-care.daily.decision",
              term: "意思決定支援",
              reading: "",
              definition: "認知症があっても本人には意思と意思決定能力があるという前提で、本人が自分で決められるよう支援すること。",
              point: "厚生労働省のガイドラインでは「意思形成 → 意思表明 → 意思実現」の支援の3段階。"
            },
            {
              id: "dementia-care.family.steps",
              term: "家族の心理的ステップ",
              reading: "",
              definition: "介護する家族の気持ちが、時間とともに変化していく過程。",
              point: "①とまどい・否定 → ②混乱・怒り・拒絶 → ③割り切り（あきらめ） → ④受容"
            },
            {
              id: "dementia-care.family.respite",
              term: "レスパイトケア",
              reading: "",
              definition: "家族が一時的に介護から離れて休息できるよう支援すること。",
              point: "ショートステイ、デイサービスなどを活用する。"
            }
          ]
        }
      ]
    },
    {
      id: "dementia-policy",
      name: "認知症を支える制度",
      summary: "認知症基本法・国の施策・地域の支援",
      pages: [
        {
          id: "main",
          title: "認知症を支える制度",
          lead: "名前と「何をするか」をセットで覚える",
          terms: [
            {
              id: "dementia-policy.law.basic-act",
              term: "認知症基本法",
              reading: "共生社会の実現を推進するための認知症基本法",
              definition: "認知症の人が尊厳を保持し、希望を持って暮らせるよう施策を進める法律。",
              point: "2023年成立・2024年1月施行。キーワードは「共生社会」。認知症の日は9月21日。"
            },
            {
              id: "dementia-policy.law.outline",
              term: "認知症施策推進大綱",
              reading: "にんちしょうしさくすいしんたいこう",
              definition: "2019年に国がまとめた認知症施策の方針。",
              point: "「共生」と「予防」を車の両輪として施策を進める。"
            },
            {
              id: "dementia-policy.law.new-orange",
              term: "新オレンジプラン",
              reading: "認知症施策推進総合戦略",
              definition: "2015年策定の総合戦略。本人の意思が尊重され、住み慣れた地域で自分らしく暮らせる社会をめざした。",
              point: "柱の一つは「認知症の人やその家族の視点の重視」。前身は2012年のオレンジプラン。"
            },
            {
              id: "dementia-policy.local.initial-team",
              term: "認知症初期集中支援チーム",
              reading: "",
              definition: "医療と介護の専門職が、認知症が疑われる人や家族を訪問し、初期の支援を集中的に行う。",
              point: "対象は40歳以上の在宅の人。期間はおおむね6か月。地域包括支援センターなどに配置。"
            },
            {
              id: "dementia-policy.local.medical-center",
              term: "認知症疾患医療センター",
              reading: "",
              definition: "鑑別診断、専門医療相談、BPSD・身体合併症の急性期対応を行う専門医療機関。",
              point: "都道府県・指定都市が指定。"
            },
            {
              id: "dementia-policy.local.supporter",
              term: "認知症サポーター",
              reading: "",
              definition: "養成講座を受け、地域で認知症の人や家族を温かく見守る応援者。",
              point: "活動の義務はない。"
            },
            {
              id: "dementia-policy.local.cafe",
              term: "認知症カフェ",
              reading: "",
              definition: "認知症の人・家族・専門職・地域の人が集い、交流や情報交換をする場。",
              point: "オレンジカフェとも呼ばれる。"
            },
            {
              id: "dementia-policy.main.driving",
              term: "高齢者の運転と認知機能検査",
              reading: "",
              definition: "75歳以上は免許更新時に認知機能検査を受ける。認知症と診断されると取消し・停止の対象。",
              point: "自主返納すると「運転経歴証明書」を受けられる。返納後の移動手段にも配慮する。"
            }
          ]
        }
      ]
    }
  ],
  area: "こころとからだのしくみ"
});
