---
title: 逆向米■游N0vaDesktop
date: 2025-12-26T13:48:48+08:00
tags:
---

首先众所周知米■游N0vaDesktop的实现是一个cef player，而且N0vaDesktop太大了，而且一旦开启就要吃掉一堆内存&CPU，而且还会拉低续航。我们想要下载N0vaDesktop中的壁纸，用Windows原生壁纸工具设置，然后直接卸载N0vaDesktop，但是一个一个点击下载按钮太难受了，所以希望自动化该流程。

声明：本文仅供学习交流使用，禁止用于任何商业用途及非法用途，作者不对因使用本文内容而产生的任何后果负责。

# 渐入

先分析`N0vaDesktop.exe`，直接查看strings，找到：

```
.rdata:0000000140B98140	00000032	C	https://api-takumi-static.■■■■■■.com/cls/backyard
.rdata:0000000140B98178	0000000C	C	/api/getFSM
.rdata:0000000140B98188	00000017	C	ListWebConf failed: %1
.rdata:0000000140B981A0	00000011	C	/api/listWebConf
.rdata:0000000140B981B8	00000015	C	ListStyle failed: %1
.rdata:0000000140B981D0	0000000F	C	/api/listStyle
.rdata:0000000140B981E0	00000022	C	ListVideoGroupsRequest failed: %1
.rdata:0000000140B98208	00000015	C	/api/listVideoGroups
.rdata:0000000140B98220	00000014	C	group_video_version
.rdata:0000000140B98238	0000001B	C	ListGroupVideos failed: %1
.rdata:0000000140B98258	0000002C	C	same request is running, skip this request.
.rdata:0000000140B98288	00000015	C	/api/listGroupVideos
.rdata:0000000140B982A8	00000018	C	/api/getVideoGroupStats
```

可以猜到这些就是API接口。

直接访问提示`{"data":null,"message":"参数错误","retcode":-1000}`

跟进到函数体内部：

```c
__int64 __fastcall sub_1400AB7E0(__int64 a1)
{
  __int64 v1; // rsi
  __int64 v2; // rax
  __int64 *v3; // r13
  void (__fastcall **v4)(_QWORD); // rbx
  __int64 v5; // rbx
  QMapDataBase *Data; // rax
  __int64 v7; // rcx
  _QWORD *v8; // rax
  unsigned __int64 v9; // rdx
  __int64 v10; // rbx
  __int64 v11; // rbx
  __int64 v12; // rax
  volatile signed __int32 *v13; // rbx
  volatile signed __int32 *v14; // rdi
  __int64 v15; // rcx
  _QWORD *v16; // rax
  __int64 v17; // rdi
  int v18; // r12d
  __int64 v19; // r14
  char v20; // si
  __int64 v21; // rdi
  volatile signed __int32 *v22; // rbx
  QMapDataBase *v23; // rax
  __int64 v24; // rcx
  _QWORD *v25; // rax
  unsigned __int64 v26; // rdx
  __int64 v27; // rdi
  _QWORD *v28; // rax
  __int64 (__fastcall *v29)(); // rcx
  __int64 v30; // rdi
  __int64 result; // rax
  signed __int32 v32; // r15d
  QMapDataBase *v33; // [rsp+50h] [rbp-B0h] BYREF
  __int128 v34; // [rsp+60h] [rbp-A0h]
  __int64 v35; // [rsp+70h] [rbp-90h] BYREF
  __int64 v36; // [rsp+78h] [rbp-88h] BYREF
  __int64 v37; // [rsp+80h] [rbp-80h] BYREF
  __int64 v38; // [rsp+88h] [rbp-78h] BYREF
  __int64 (__fastcall *v39)(); // [rsp+90h] [rbp-70h] BYREF
  __int64 v40[2]; // [rsp+98h] [rbp-68h] BYREF
  char v41[8]; // [rsp+A8h] [rbp-58h] BYREF
  char v42[8]; // [rsp+B0h] [rbp-50h] BYREF
  char v43[16]; // [rsp+B8h] [rbp-48h] BYREF
  __int64 v44; // [rsp+C8h] [rbp-38h] BYREF
  char v45[16]; // [rsp+D0h] [rbp-30h] BYREF
  __int64 v46; // [rsp+E0h] [rbp-20h]
  char v47[16]; // [rsp+E8h] [rbp-18h] BYREF
  __int64 v48; // [rsp+F8h] [rbp-8h] BYREF
  char v49[8]; // [rsp+100h] [rbp+0h] BYREF
  void *Block; // [rsp+108h] [rbp+8h]
  __int128 v51; // [rsp+110h] [rbp+10h] BYREF
  __int128 v52; // [rsp+120h] [rbp+20h] BYREF
  __int128 v53; // [rsp+130h] [rbp+30h] BYREF
  __int128 v54[5]; // [rsp+140h] [rbp+40h] BYREF
  _QWORD *v56; // [rsp+1A0h] [rbp+A0h]
  volatile signed __int32 *v57; // [rsp+1A8h] [rbp+A8h] BYREF
  volatile signed __int32 *v58; // [rsp+1B0h] [rbp+B0h] BYREF
  QMapDataBase *v59; // [rsp+1B8h] [rbp+B8h] BYREF

  v48 = -2i64;
  v1 = a1;
  v2 = sub_14017DF80(v49);
  v3 = (__int64 *)(v1 + 64);
  sub_1400A2C70(v1 + 64, v2);
  v4 = (void (__fastcall **)(_QWORD))Block;
  if ( Block )
  {
    if ( _InterlockedExchangeAdd((volatile signed __int32 *)Block + 1, 0xFFFFFFFF) == 1 )
      v4[1](v4);
    if ( _InterlockedExchangeAdd((volatile signed __int32 *)v4, 0xFFFFFFFF) == 1 )
      j_free_0(v4);
  }
  v40[0] = QString::fromAscii_helper("content-type", 12i64);
  v40[1] = QString::fromAscii_helper("application/json", 16i64);
  *(_QWORD *)&v34 = v40;
  *((_QWORD *)&v34 + 1) = v41;
  v51 = v34;
  sub_1400A29B0(&v58, &v51);
  `eh vector destructor iterator'(v40, 0x10ui64, 1ui64, sub_140082BC0);
  v5 = *v3;
  if ( *v58 )
  {
    if ( *v58 != -1 )
      _InterlockedExchangeAdd(v58, 1u);
    v59 = (QMapDataBase *)v58;
  }
  else
  {
    Data = (QMapDataBase *)QMapDataBase::createData();
    v59 = Data;
    v7 = *((_QWORD *)v58 + 2);
    if ( v7 )
    {
      v8 = (_QWORD *)sub_1400855D0(v7, Data);
      *((_QWORD *)v59 + 2) = v8;
      v9 = (unsigned __int64)v59 + 8;
      *v8 &= 3ui64;
      *v8 |= v9;
      QMapDataBase::recalcMostLeftNode(v59);
    }
  }
  sub_14017FBC0(v5, &v59);
  v10 = *v3;
  v36 = QString::fromAscii_helper("https://api-takumi-static.■■■■■■.com/cls/backyard", 49i64);
  sub_14017FAB0(v10, &v36);
  QString::~QString(&v36);
  v11 = *v3;
  v37 = QString::fromAscii_helper("/api/listVideoGroups", 20i64);
  sub_1400C2470(v11, &v37);
  QString::~QString(&v37);
  v44 = QString::fromAscii_helper("app_id", 6i64);
  QVariant::QVariant((QVariant *)v45, "5f17af398d20e6ddc9767e5a");
  v46 = QString::fromAscii_helper("group_video_version", 19i64);
  QVariant::QVariant((QVariant *)v47, 0);
  *(_QWORD *)&v34 = &v44;
  *((_QWORD *)&v34 + 1) = &v48;
  v52 = v34;
  sub_1400A2B10(&v57, &v52);
  `eh vector destructor iterator'(&v44, 0x18ui64, 2ui64, sub_140082BF0);
  v38 = QString::fromAscii_helper("false", 5i64);
  LOBYTE(v11) = QString::operator==(&v38, "true");
  QString::~QString(&v38);
  if ( (_BYTE)v11 )
  {
    QVariant::QVariant((QVariant *)v43, "false");
    v35 = QString::fromAscii_helper("is_preview", 10i64);
    if ( *v57 <= 1u )
    {
      v13 = v57;
    }
    else
    {
      v12 = QMapDataBase::createData();
      v13 = (volatile signed __int32 *)v12;
      v14 = v57;
      v15 = *((_QWORD *)v57 + 2);
      if ( v15 )
      {
        v16 = (_QWORD *)sub_140085690(v15, v12);
        *((_QWORD *)v13 + 2) = v16;
        *v16 &= 3ui64;
        *v16 |= (unsigned __int64)(v13 + 2);
      }
      if ( !*v14 || *v14 != -1 && _InterlockedExchangeAdd(v57, 0xFFFFFFFF) == 1 )
        sub_1400859D0(v57);
      v57 = v13;
      QMapDataBase::recalcMostLeftNode((QMapDataBase *)v13);
    }
    v17 = *((_QWORD *)v13 + 2);
    v18 = (_DWORD)v13 + 8;
    v19 = 0i64;
    v20 = 1;
    if ( !v17 )
      goto LABEL_30;
    do
    {
      v18 = v17;
      if ( (unsigned __int8)operator<(v17 + 24, &v35) )
      {
        v20 = 0;
        v17 = *(_QWORD *)(v17 + 16);
      }
      else
      {
        v19 = v17;
        v20 = 1;
        v17 = *(_QWORD *)(v17 + 8);
      }
    }
    while ( v17 );
    if ( v19 && !(unsigned __int8)operator<(&v35, v19 + 24) )
      QVariant::operator=(v19 + 32, v43);
    else
LABEL_30:
      sub_140085850((_DWORD)v13, (unsigned int)&v35, (unsigned int)v43, v18, v20);
    QString::~QString(&v35);
    QVariant::~QVariant((QVariant *)v43);
    v1 = a1;
  }
  else
  {
    v13 = v57;
  }
  v21 = *v3;
  if ( *v13 )
  {
    if ( *v13 != -1 )
      _InterlockedExchangeAdd(v57, 1u);
    v22 = v57;
    v33 = (QMapDataBase *)v57;
  }
  else
  {
    v23 = (QMapDataBase *)QMapDataBase::createData();
    v33 = v23;
    v22 = v57;
    v24 = *((_QWORD *)v57 + 2);
    if ( v24 )
    {
      v25 = (_QWORD *)sub_140085690(v24, v23);
      *((_QWORD *)v33 + 2) = v25;
      v26 = (unsigned __int64)v33 + 8;
      *v25 &= 3ui64;
      *v25 |= v26;
      QMapDataBase::recalcMostLeftNode(v33);
    }
  }
  sub_14017FCB0(v21, &v33);
  *(_QWORD *)&v34 = sub_1401CAAB0;
  DWORD2(v34) = 0;
  v53 = v34;
  v27 = *v3;
  v39 = sub_1400ADCF0;
  v28 = operator new(0x18ui64);
  v29 = v39;
  *(_DWORD *)v28 = 1;
  v28[1] = &sub_140086290;
  v28[2] = v29;
  QObject::connectImpl(v41, v27, &v53, v1, &v39, v28, 0, 0i64, &qword_140D1C6F0);
  QMetaObject::Connection::~Connection((QMetaObject::Connection *)v41);
  *(_QWORD *)&v34 = sub_1401CAA20;
  DWORD2(v34) = 0;
  v30 = *v3;
  v54[0] = v34;
  v56 = operator new(0x18ui64);
  *(_DWORD *)v56 = 1;
  v56[1] = &sub_1400B4A00;
  QObject::connectImpl(v42, v30, v54, v30, 0i64, v56, 1, 0i64, &qword_140D1C6F0);
  QMetaObject::Connection::~Connection((QMetaObject::Connection *)v42);
  if ( !*v22 || *v22 != -1 && _InterlockedExchangeAdd(v57, 0xFFFFFFFF) == 1 )
    sub_1400859D0(v57);
  result = (__int64)v58;
  if ( !*v58 )
    return sub_140085960(v58);
  if ( *v58 != -1 )
  {
    v32 = _InterlockedExchangeAdd(v58, 0xFFFFFFFF);
    result = (unsigned int)(v32 - 1);
    if ( v32 == 1 )
      return sub_140085960(v58);
  }
  return result;
}
```

可以看到请求的URL是`https://api-takumi-static.■■■■■■.com/cls/backyard/api/listVideoGroups`，请求头有`content-type: application/json`，请求体是一个JSON对象，包含`app_id`和`group_video_version`字段。
`app_id`的值是固定的`5f17af398d20e6ddc9767e5a`，`group_video_version`的值是0。

发送这个请求可以得到响应：

```json
{"retcode":0,"message":"OK","data":{"cipher_text":"BKz4IZOvkyzwYAXKDPi2BKEQqTLF29QyLsWt52Zt+iIx2Cs2k9wbmu5oWHOkYL7Nb45QXPdIS7LXt9rhEBR7QQwhhlrME463UPKrsK/E20n/Voni9IBmZLGxK9mBWrIVge7v06RH5dOg1VOBR/lIb0fs9J90Ely00AxaFTj8pg2QK9fosQP9CITav7pFaHriHxM6FfquMtNIyHs+Yv7sR3VYhEMAgqm7hgq6Y2gYnf1grHe2VIwb2qeLB6RKnHfD5HO19fRJmWprWy3pTQE/GRBHyIqJCmtuvKNzsvJ4FmqENTOqUiGxDZzKV9E09FSWveDEBDAk67CRskoh2yghEL45scSojVrBTZZvrvT+pHOcJU2DG95mLiVpuwdtOLleuBUSQzuabgIhwidqXPo0r6DaMJGI4ou/70LXy8pmvI1SmHT1kaNgNT0FFikDG9uBaVAIxOEXT8pw5iV1PDhDnCNkJy9GhvmJaHxFCupTkDyR9mayTSDcoo0oDj7SidY1IU3VsoMzKEFwbJB3amFzicLl9ldSAqJPf4waf0lBVsucJGT6BVl44egazxlSpA6yGr6gLI5Lx1NfbabvRe28GdskNX5QGxkkhIbAg8Sn2Po="}}
```

注意到`data`字段中的`cipher_text`，这是一个加密后的字符串。（首先肯定不是纯base64）

# 解密

在刚才那一系列strings周围，找到了一个：

```
.rdata:0000000140B98000	00000010	C	GetFsm success.
.rdata:0000000140B98010	0000000F	C	invalid input.
.rdata:0000000140B98020	0000001F	C	get text from response failed.
.rdata:0000000140B98040	00000013	C	ListWebConf succss
.rdata:0000000140B98058	00000013	C	ListStyle success.
.rdata:0000000140B98070	00000019	C	ListVideoGroups success.
.rdata:0000000140B98090	00000019	C	ListGroupVideos success.
.rdata:0000000140B980B0	0000001C	C	GetVideoGroupStats success.
```

推测与响应处理有关，跟进到函数：

注意到这么一段：

```c
 if ( *(_DWORD *)(*(_QWORD *)a2 + 4i64) )
  {
    sub_140087A20((QByteArray *)v18, a2);
    if ( *(_DWORD *)(v18[0] + 4) )
    {
      sub_1400B3100(a1, v18);
    }
    else
    {
      v14 = (__int64 *)LogUtil::mainLogger(v13);
      if ( strrchr("..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\VideoDataCenter.cpp", 92) )
        v5 = strrchr("..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\VideoDataCenter.cpp", 92) + 1;
      v23[0] = getpid();
      v24 = v5;
      v25 = 345;
      v26 = "get text from response failed.";
      *(_QWORD *)&v17 = 428450i64;
      *((_QWORD *)&v17 + 1) = v23;
      v19 = v17;
      *(_QWORD *)&v17 = "[{}] [{}:{}] {}";
      *((_QWORD *)&v17 + 1) = 15i64;
      sub_14007EDC0(Block, &v17, &v19);
      v15 = Block;
      if ( v22 >= 0x10 )
        v15 = (void **)Block[0];
      *(_QWORD *)&v17 = v15;
      sub_140093700(*v14, 4, &v17);
      if ( v22 >= 0x10 )
      {
        v16 = Block[0];
        if ( v22 + 1 >= 0x1000 )
        {
          v16 = (void *)*((_QWORD *)Block[0] - 1);
          if ( (unsigned __int64)(Block[0] - v16 - 8) > 0x1F )
            invalid_parameter_noinfo_noreturn();
        }
        j_j_free_0(v16);
      }
    }
    QByteArray::~QByteArray((QByteArray *)v18);
  }
```

先`sub_140087A20((QByteArray *)v18, a2);`如果`*(_DWORD *)(v18[0] + 4)`那么调用`sub_1400B3100(a1, v18);`，否则就会记录日志“get text from response failed.”，这难道不引人注意吗？

前面一个函数：

```c
QByteArray *__fastcall sub_140087A20(QByteArray *a1, __int64 a2)
{
  __int64 v3; // rcx
  __int64 v4; // rsi
  char *v5; // rbx
  void **v6; // rax
  void *v7; // rcx
  __int64 v8; // rax
  __int64 v9; // rax
  QVariant *v10; // rax
  int v11; // ebx
  __int64 v12; // rax
  __int64 v13; // rax
  __int64 v14; // rcx
  _QWORD *v15; // rsi
  __int64 v16; // r14
  char *v17; // rbx
  void **v18; // rcx
  __int64 v19; // rax
  void *v20; // rcx
  void *v21; // rcx
  bool v22; // bl
  __int64 v23; // rcx
  __int64 v24; // rsi
  char *v25; // rbx
  void **v26; // rax
  __int64 v27; // rax
  __int64 v28; // rax
  __int64 v29; // rax
  __int128 v31; // [rsp+30h] [rbp-D0h] BYREF
  __int64 v32; // [rsp+40h] [rbp-C0h]
  char v33[8]; // [rsp+50h] [rbp-B0h] BYREF
  char v34[8]; // [rsp+58h] [rbp-A8h] BYREF
  int v35; // [rsp+60h] [rbp-A0h] BYREF
  char v36[8]; // [rsp+68h] [rbp-98h] BYREF
  char v37[16]; // [rsp+70h] [rbp-90h] BYREF
  __int128 v38[2]; // [rsp+80h] [rbp-80h] BYREF
  __int128 v39; // [rsp+A0h] [rbp-60h] BYREF
  __int64 v40; // [rsp+B0h] [rbp-50h]
  QByteArray *v41; // [rsp+C0h] [rbp-40h] BYREF
  char v42[16]; // [rsp+C8h] [rbp-38h] BYREF
  __int64 v43; // [rsp+D8h] [rbp-28h]
  void *Block[2]; // [rsp+E0h] [rbp-20h] BYREF
  __m128i si128; // [rsp+F0h] [rbp-10h]
  void *v46[2]; // [rsp+100h] [rbp+0h] BYREF
  unsigned __int64 v47; // [rsp+118h] [rbp+18h]
  int v48[4]; // [rsp+120h] [rbp+20h] BYREF
  char *v49; // [rsp+130h] [rbp+30h]
  int v50; // [rsp+140h] [rbp+40h]
  const char *v51; // [rsp+150h] [rbp+50h]

  v43 = -2i64;
  v41 = a1;
  QJsonDocument::fromJson(v34, a2, &v41);
  if ( !HIDWORD(v41) )
  {
    QString::QString((QString *)v33);
    v8 = QJsonDocument::toVariant(v34, &v39);
    QVariant::toJsonObject(v8, v37);
    QVariant::~QVariant((QVariant *)&v39);
    v46[0] = (void *)QString::fromAscii_helper("retcode", 7i64);
    v9 = QJsonObject::value(v37, v38, v46);
    v10 = (QVariant *)QJsonValue::toVariant(v9, &v31);
    v11 = QVariant::toInt(v10, 0i64);
    QVariant::~QVariant((QVariant *)&v31);
    v35 = v11;
    QJsonValue::~QJsonValue((QJsonValue *)v38);
    QString::~QString(v46);
    *(_QWORD *)&v31 = QString::fromAscii_helper("message", 7i64);
    v12 = QJsonObject::value(v37, Block, &v31);
    v13 = QJsonValue::toVariant(v12, v38);
    QVariant::toString(v13, v46);
    QVariant::~QVariant((QVariant *)v38);
    QString::operator=(v33, v46);
    QString::~QString(v46);
    QJsonValue::~QJsonValue((QJsonValue *)Block);
    QString::~QString(&v31);
    if ( v11 )
    {
      v15 = (_QWORD *)LogUtil::mainLogger(v14);
      v16 = QString::toStdString(v33, v46);
      v17 = "..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\DataCenterCommon.cpp";
      if ( strrchr("..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\DataCenterCommon.cpp", 92) )
        v17 = strrchr("..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\DataCenterCommon.cpp", 92) + 1;
      v48[0] = getpid();
      v49 = v17;
      v50 = 34;
      v51 = "retcode is {}, msg: {}";
      *(_QWORD *)&v31 = 428450i64;
      *((_QWORD *)&v31 + 1) = v48;
      v38[0] = v31;
      *(_QWORD *)&v31 = "[{}] [{}:{}] {}";
      *((_QWORD *)&v31 + 1) = 15i64;
      v39 = v31;
      sub_14007EDC0(Block);
      v18 = Block;
      if ( si128.m128i_i64[1] >= 0x10ui64 )
        v18 = (void **)Block[0];
      HIDWORD(v39) = 0;
      *(_QWORD *)&v31 = v18;
      v19 = -1i64;
      do
        ++v19;
      while ( *((_BYTE *)v18 + v19) );
      *((_QWORD *)&v31 + 1) = v19;
      *(_QWORD *)&v39 = 0i64;
      DWORD2(v39) = 0;
      v40 = 0i64;
      v38[0] = v31;
      v31 = v39;
      v32 = 0i64;
      sub_14007C020(*v15, (unsigned int)&v31, 4, (unsigned int)v38, (__int64)&v35, v16);
      if ( si128.m128i_i64[1] >= 0x10ui64 )
      {
        v20 = Block[0];
        if ( (unsigned __int64)(si128.m128i_i64[1] + 1) >= 0x1000 )
        {
          v20 = (void *)*((_QWORD *)Block[0] - 1);
          if ( (unsigned __int64)(Block[0] - v20 - 8) > 0x1F )
            invalid_parameter_noinfo_noreturn();
        }
        j_j_free_0(v20);
      }
      si128 = _mm_load_si128((const __m128i *)&xmmword_140B92A70);
      LOBYTE(Block[0]) = 0;
      if ( v47 < 0x10 )
        goto LABEL_29;
      v21 = v46[0];
      if ( v47 + 1 >= 0x1000 )
      {
        v21 = (void *)*((_QWORD *)v46[0] - 1);
        if ( (unsigned __int64)(v46[0] - v21 - 8) > 0x1F )
          invalid_parameter_noinfo_noreturn();
      }
    }
    else
    {
      *(_QWORD *)&v31 = QString::fromAscii_helper("data", 4i64);
      v22 = QJsonObject::contains((QJsonObject *)v37, (const struct QString *)&v31);
      QString::~QString(&v31);
      if ( v22 )
      {
        *(_QWORD *)&v31 = QString::fromAscii_helper("data", 4i64);
        v27 = QJsonObject::value(v37, Block, &v31);
        QJsonValue::toObject(v27, v42);
        QJsonValue::~QJsonValue((QJsonValue *)Block);
        QString::~QString(&v31);
        QString::QString((QString *)v36);
        v46[0] = (void *)QString::fromAscii_helper("cipher_text", 11i64);
        v28 = QJsonObject::value(v42, Block, v46);
        v29 = QJsonValue::toVariant(v28, v38);
        QVariant::toString(v29, &v31);
        QVariant::~QVariant((QVariant *)v38);
        QString::operator=(v36, &v31);
        QString::~QString(&v31);
        QJsonValue::~QJsonValue((QJsonValue *)Block);
        QString::~QString(v46);
        QString::toUtf8(v36, a1);
        QString::~QString(v36);
        QJsonObject::~QJsonObject((QJsonObject *)v42);
        goto LABEL_40;
      }
      v24 = LogUtil::mainLogger(v23);
      v25 = "..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\DataCenterCommon.cpp";
      if ( strrchr("..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\DataCenterCommon.cpp", 92) )
        v25 = strrchr("..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\DataCenterCommon.cpp", 92) + 1;
      v48[0] = getpid();
      v49 = v25;
      v50 = 38;
      v51 = "data is empty!";
      *(_QWORD *)&v31 = 428450i64;
      *((_QWORD *)&v31 + 1) = v48;
      v38[0] = v31;
      *(_QWORD *)&v31 = "[{}] [{}:{}] {}";
      *((_QWORD *)&v31 + 1) = 15i64;
      sub_14007EDC0(Block);
      v26 = Block;
      if ( si128.m128i_i64[1] >= 0x10ui64 )
        v26 = (void **)Block[0];
      *(_QWORD *)&v31 = v26;
      sub_1400787E0(v24, &v31);
      if ( si128.m128i_i64[1] < 0x10ui64 )
      {
LABEL_29:
        QByteArray::QByteArray(a1);
LABEL_40:
        QJsonObject::~QJsonObject((QJsonObject *)v37);
        QString::~QString(v33);
        goto LABEL_41;
      }
      v21 = Block[0];
      if ( (unsigned __int64)(si128.m128i_i64[1] + 1) >= 0x1000 )
      {
        v21 = (void *)*((_QWORD *)Block[0] - 1);
        if ( (unsigned __int64)(Block[0] - v21 - 8) > 0x1F )
          invalid_parameter_noinfo_noreturn();
      }
    }
    j_j_free_0(v21);
    goto LABEL_29;
  }
  v4 = LogUtil::mainLogger(v3);
  v5 = "..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\DataCenterCommon.cpp";
  if ( strrchr("..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\DataCenterCommon.cpp", 92) )
    v5 = strrchr("..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\DataCenterCommon.cpp", 92) + 1;
  v48[0] = getpid();
  v49 = v5;
  v50 = 23;
  v51 = "parse response error.";
  *(_QWORD *)&v31 = 428450i64;
  *((_QWORD *)&v31 + 1) = v48;
  *(_OWORD *)v46 = v31;
  *(_QWORD *)&v31 = "[{}] [{}:{}] {}";
  *((_QWORD *)&v31 + 1) = 15i64;
  sub_14007EDC0(Block);
  v6 = Block;
  if ( si128.m128i_i64[1] >= 0x10ui64 )
    v6 = (void **)Block[0];
  *(_QWORD *)&v31 = v6;
  sub_1400787E0(v4, &v31);
  if ( si128.m128i_i64[1] >= 0x10ui64 )
  {
    v7 = Block[0];
    if ( (unsigned __int64)(si128.m128i_i64[1] + 1) >= 0x1000 )
    {
      v7 = (void *)*((_QWORD *)Block[0] - 1);
      if ( (unsigned __int64)(Block[0] - v7 - 8) > 0x1F )
        invalid_parameter_noinfo_noreturn();
    }
    j_j_free_0(v7);
  }
  QByteArray::QByteArray(a1);
LABEL_41:
  QJsonDocument::~QJsonDocument((QJsonDocument *)v34);
  return a1;
}
```

注意到里面提到了`data`还有`cipher_text`字段，正好跟响应JSON对应。问了AI说它就是从响应中提取cipher_text字段。

继续跟进到`sub_1400B3100(a1, v18);`：

```c
void __fastcall sub_1400B3100(__int64 a1, __int64 a2)
{
  __int64 v3; // rcx
  __int64 *v4; // rdi
  char *v5; // rbx
  void **v6; // rax
  void *v7; // rcx
  __int64 v8; // rax
  __int64 v9; // rax
  __int64 v10; // [rsp+28h] [rbp-E0h] BYREF
  __int64 v11; // [rsp+30h] [rbp-D8h] BYREF
  char v12[8]; // [rsp+38h] [rbp-D0h] BYREF
  char v13[8]; // [rsp+40h] [rbp-C8h] BYREF
  __int64 v14; // [rsp+48h] [rbp-C0h] BYREF
  volatile signed __int32 *v15; // [rsp+50h] [rbp-B8h] BYREF
  __int128 v16; // [rsp+58h] [rbp-B0h]
  __int64 v17[2]; // [rsp+68h] [rbp-A0h] BYREF
  __int128 v18; // [rsp+78h] [rbp-90h] BYREF
  __int128 v19; // [rsp+88h] [rbp-80h] BYREF
  char v20[16]; // [rsp+98h] [rbp-70h] BYREF
  void *Block[3]; // [rsp+A8h] [rbp-60h] BYREF
  unsigned __int64 v22; // [rsp+C0h] [rbp-48h]
  int v23; // [rsp+C8h] [rbp-40h] BYREF
  char *v24; // [rsp+D8h] [rbp-30h]
  int v25; // [rsp+E8h] [rbp-20h]
  const char *v26; // [rsp+F8h] [rbp-10h]

  v17[1] = -2i64;
  sub_1400879C0((__int64)v13, a2);
  v11 = 0i64;
  QJsonDocument::fromJson(v12, v13, &v11);
  if ( HIDWORD(v11) )
  {
    v4 = (__int64 *)LogUtil::mainLogger(v3);
    v5 = "..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\VideoDataCenter.cpp";
    if ( strrchr("..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\VideoDataCenter.cpp", 92) )
      v5 = strrchr("..\\..\\..\\src\\Applications\\DeskPortal\\DataCenter\\VideoDataCenter.cpp", 92) + 1;
    v23 = getpid();
    v24 = v5;
    v25 = 991;
    v26 = "invalid input.";
    *(_QWORD *)&v16 = 428450i64;
    *((_QWORD *)&v16 + 1) = &v23;
    v18 = v16;
    *(_QWORD *)&v16 = "[{}] [{}:{}] {}";
    *((_QWORD *)&v16 + 1) = 15i64;
    v19 = v16;
    sub_14007EDC0(Block, &v19, &v18);
    v6 = Block;
    if ( v22 >= 0x10 )
      v6 = (void **)Block[0];
    v17[0] = (__int64)v6;
    sub_140093700(*v4, 4, v17);
    if ( v22 >= 0x10 )
    {
      v7 = Block[0];
      if ( v22 + 1 >= 0x1000 )
      {
        v7 = (void *)*((_QWORD *)Block[0] - 1);
        if ( (unsigned __int64)(Block[0] - v7 - 8) > 0x1F )
          invalid_parameter_noinfo_noreturn();
      }
      j_j_free_0(v7);
    }
  }
  else
  {
    LOBYTE(v10) = 0;
    v8 = QJsonDocument::toVariant(v12, v20);
    sub_1400A1310(&v14, v8, &v10);
    QVariant::~QVariant((QVariant *)v20);
    if ( (_BYTE)v10 )
    {
      v9 = sub_140095EB0();
      if ( (unsigned __int8)sub_140097510(v9, &v14) )
      {
        sub_1400B2EC0(a1);
        sub_1401B9190(a1);
      }
      else
      {
        sub_1401B9170(a1);
      }
    }
    sub_1400B2D00(a1);
    sub_1400B0130(a1);
    if ( !*v15 || *v15 != -1 && _InterlockedExchangeAdd(v15, 0xFFFFFFFF) == 1 )
      sub_1400B3DB0(&v15, v15);
  }
  QJsonDocument::~QJsonDocument((QJsonDocument *)v12);
  QByteArray::~QByteArray((QByteArray *)v13);
}
```

上来就是

```c
  v17[1] = -2i64;
  sub_1400879C0((__int64)v13, a2);
  v11 = 0i64;
  QJsonDocument::fromJson(v12, v13, &v11);
```

你看它fromJson，那么`sub_1400879C0((__int64)v13, a2);`肯定是要从cipher_text里面搞出一个json。

```c
__int64 __fastcall sub_1400879C0(__int64 a1, __int64 a2)
{
  __int64 v5; // [rsp+40h] [rbp+8h] BYREF

  v5 = a1;
  QString::QString((QString *)&v5);
  sub_1401A1CE0(&v5);
  CryptoOperator::DecodeAes(a1, a2, &v5);
  QString::~QString(&v5);
  return a1;
}
```

这不就看到曙光了，它调用了`CryptoOperator::DecodeAes`。

```c
void __fastcall sub_1401A1CE0(__int64 a1)
{
  const struct QString *v2; // rdi
  const struct QString *v3; // rax
  QString *v4; // rbx
  __int64 v5; // [rsp+20h] [rbp-38h] BYREF
  char v6[8]; // [rsp+28h] [rbp-30h] BYREF
  char v7[8]; // [rsp+30h] [rbp-28h] BYREF
  __int64 v8; // [rsp+38h] [rbp-20h]
  char v9; // [rsp+70h] [rbp+18h] BYREF
  __int64 v10; // [rsp+78h] [rbp+20h] BYREF

  v8 = -2i64;
  v5 = QString::fromAscii_helper("aomKlo+qx6Djr", 13i64);
  v10 = QString::fromAscii_helper("rHcTGz1pPLGH", 12i64);
  v2 = (const struct QString *)QString::left(&v10, v7, 8i64);
  v3 = (const struct QString *)QString::right(&v5, v6, 8i64);
  v4 = QString::QString((QString *)&v9, v3);
  QString::append((QString *)&v9, v2);
  QString::operator=(a1, v4);
  QString::~QString(&v9);
  QString::~QString(v6);
  QString::~QString(v7);
  QString::~QString(&v10);
  QString::~QString(&v5);
}
```

很明显这个函数是用来生成AES密钥的，密钥是把字符串"aomKlo+qx6Djr"的后8位跟"rHcTGz1pPLGH"的前8位拼接起来得到的，也就是`o+qx6DjrrHcTGz1p`。

问题是还差一个iv向量，没有看到iv相关的东西，~~猜测可能是全0向量（解一下发现第一个block乱码）~~。

问题是`CryptoOperator::DecodeAes(a1, a2, &v5);`这个函数不是在`N0vaDesktop.exe`中实现的，直接去看导入表：

```
00000001403CD5E0		CryptoOperator::DecodeAes(QByteArray const &,QString const &)	MHYDPInterFace
```

所以接下来逆向`MHYDPInterFace.dll`，目标是获得iv。


```c
__int64 __fastcall CryptoOperator::DecodeAes(__int64 a1, __int64 a2, __int64 a3)
{
  __int64 v6; // rdi
  int v7; // eax
  __int64 v8; // rax
  char v10[8]; // [rsp+38h] [rbp-2A0h] BYREF
  char v11[8]; // [rsp+40h] [rbp-298h] BYREF
  char v12[8]; // [rsp+48h] [rbp-290h] BYREF
  __int64 v13; // [rsp+50h] [rbp-288h]
  __int64 v14; // [rsp+58h] [rbp-280h]
  char v15[592]; // [rsp+60h] [rbp-278h] BYREF

  v13 = -2i64;
  v14 = a1;
  sub_1800035E0(v15, 0i64, 1i64);
  v6 = QString::toUtf8(a3, v10);
  LODWORD(a3) = QString::toUtf8(a3, v12);
  v7 = QByteArray::fromBase64(v11, a2);
  sub_180004080((unsigned int)v15, a1, v7, a3, v6);
  QByteArray::~QByteArray((QByteArray *)v11);
  QByteArray::~QByteArray((QByteArray *)v12);
  QByteArray::~QByteArray((QByteArray *)v10);
  v8 = sub_180005720(v15, v10, a1);
  QByteArray::operator=(a1, v8);
  QByteArray::~QByteArray((QByteArray *)v10);
  QObject::~QObject((QObject *)v15);
  return a1;
}

__int64 __fastcall sub_1800035E0(__int64 a1, int a2, int a3, int a4)
{
  int v8; // ebp

  QObject::QObject((QObject *)a1, 0i64);
  *(_DWORD *)(a1 + 16) = 4;
  *(_QWORD *)a1 = &QAESEncryption::`vftable';
  *(_DWORD *)(a1 + 20) = 16;
  *(_DWORD *)(a1 + 24) = a2;
  *(_DWORD *)(a1 + 28) = a3;
  *(_DWORD *)(a1 + 48) = a4;
  *(_BYTE *)(a1 + 52) = 0;
  *(_DWORD *)(a1 + 64) = 2071428195;
  *(_DWORD *)(a1 + 68) = -982553614;
  *(_DWORD *)(a1 + 72) = 728170800;
  *(_DWORD *)(a1 + 76) = 1990973438;
  *(_DWORD *)(a1 + 80) = 2110358218;
  *(_DWORD *)(a1 + 84) = -263759366;
  *(_DWORD *)(a1 + 88) = -1348283219;
  *(_DWORD *)(a1 + 92) = -1066228580;
  *(_DWORD *)(a1 + 96) = 647232951;
  *(_DWORD *)(a1 + 100) = -856211658;
  *(_DWORD *)(a1 + 104) = -236608204;
  *(_DWORD *)(a1 + 108) = 355588209;
  *(_DWORD *)(a1 + 112) = -1021065468;
  *(_DWORD *)(a1 + 116) = -1710909928;
  *(_DWORD *)(a1 + 120) = -494923257;
  *(_DWORD *)(a1 + 124) = 1974609899;
  *(_DWORD *)(a1 + 128) = 439124745;
  *(_DWORD *)(a1 + 132) = -1604686309;
  *(_DWORD *)(a1 + 136) = -1277805742;
  *(_DWORD *)(a1 + 140) = -2077236439;
  *(_DWORD *)(a1 + 144) = -318713517;
  *(_DWORD *)(a1 + 148) = 1538391072;
  *(_DWORD *)(a1 + 152) = 968805226;
  *(_DWORD *)(a1 + 156) = -816296886;
  *(_DWORD *)(a1 + 160) = -72683568;
  *(_DWORD *)(a1 + 164) = -2060235453;
  *(_DWORD *)(a1 + 168) = 2130901317;
  *(_DWORD *)(a1 + 172) = -1465959344;
  *(_DWORD *)(a1 + 176) = -1891589295;
  *(_DWORD *)(a1 + 180) = -180839022;
  *(_DWORD *)(a1 + 184) = 567981756;
  *(_DWORD *)(a1 + 188) = -755761392;
  *(_DWORD *)(a1 + 192) = -334295859;
  *(_DWORD *)(a1 + 196) = 390371167;
  *(_DWORD *)(a1 + 200) = 1031710660;
  *(_DWORD *)(a1 + 204) = 1931042148;
  *(_DWORD *)(a1 + 208) = -598769312;
  *(_DWORD *)(a1 + 212) = -2003817950;
  *(_DWORD *)(a1 + 216) = 347663942;
  *(_DWORD *)(a1 + 220) = -620011810;
  *(_DWORD *)(a1 + 224) = 171586272;
  *(_DWORD *)(a1 + 228) = 1545864777;
  *(_DWORD *)(a1 + 232) = 1655493570;
  *(_DWORD *)(a1 + 236) = 2045023633;
  *(_DWORD *)(a1 + 240) = 1832372455;
  *(_DWORD *)(a1 + 244) = -1454451315;
  *(_DWORD *)(a1 + 248) = -353085844;
  *(_DWORD *)(a1 + 252) = 145652325;
  *(_DWORD *)(a1 + 256) = 774207674;
  *(_DWORD *)(a1 + 260) = -961239524;
  *(_DWORD *)(a1 + 264) = 527752680;
  *(_DWORD *)(a1 + 268) = -1970553525;
  *(_DWORD *)(a1 + 272) = 1723154032;
  *(_DWORD *)(a1 + 276) = 251003720;
  *(_DWORD *)(a1 + 280) = -1185467039;
  *(_DWORD *)(a1 + 284) = -1642217082;
  *(_DWORD *)(a1 + 288) = 295237857;
  *(_DWORD *)(a1 + 292) = -1802577559;
  *(_DWORD *)(a1 + 296) = -377020773;
  *(_DWORD *)(a1 + 300) = -551004722;
  *(_DWORD *)(a1 + 304) = 227123596;
  *(_DWORD *)(a1 + 308) = 1749214911;
  *(_DWORD *)(a1 + 312) = 254646593;
  *(_DWORD *)(a1 + 316) = 381375664;
  *(_DWORD *)(a1 + 320) = -714471086;
  *(_DWORD *)(a1 + 324) = 950351408;
  *(_DWORD *)(a1 + 328) = -1633468225;
  *(_DWORD *)(a1 + 332) = -69733503;
  *(_DWORD *)(a1 + 336) = -2110135428;
  *(_DWORD *)(a1 + 340) = -2013319269;
  *(_DWORD *)(a1 + 344) = 1145278004;
  *(_DWORD *)(a1 + 348) = -873865532;
  *(_DWORD *)(a1 + 352) = 848591700;
  *(_DWORD *)(a1 + 356) = 1025753766;
  *(_DWORD *)(a1 + 360) = 194333934;
  *(_DWORD *)(a1 + 364) = 1321466434;
  *(_DWORD *)(a1 + 368) = 1721839112;
  *(_DWORD *)(a1 + 372) = -1306207960;
  *(_DWORD *)(a1 + 376) = 1235377014;
  *(_DWORD *)(a1 + 380) = 634489709;
  *(_DWORD *)(a1 + 384) = 1693907058;
  *(_DWORD *)(a1 + 388) = 379086982;
  *(_DWORD *)(a1 + 392) = -866343724;
  *(_DWORD *)(a1 + 396) = -1833540259;
  *(_DWORD *)(a1 + 400) = 1346924652;
  *(_DWORD *)(a1 + 404) = -625349123;
  *(_DWORD *)(a1 + 408) = 1464210782;
  *(_DWORD *)(a1 + 412) = -2070049369;
  *(_DWORD *)(a1 + 416) = 11262096;
  *(_DWORD *)(a1 + 420) = 181648524;
  *(_DWORD *)(a1 + 424) = 89711863;
  *(_DWORD *)(a1 + 428) = 105231288;
  *(_DWORD *)(a1 + 432) = -1893847856;
  *(_DWORD *)(a1 + 436) = 34553802;
  *(_DWORD *)(a1 + 440) = 62762945;
  *(_DWORD *)(a1 + 444) = 1804210945;
  *(_DWORD *)(a1 + 448) = 1091670330;
  *(_DWORD *)(a1 + 452) = -354654385;
  *(_DWORD *)(a1 + 456) = -825232745;
  *(_DWORD *)(a1 + 460) = 1944499440;
  *(_DWORD *)(a1 + 464) = 578071702;
  *(_DWORD *)(a1 + 468) = -2060079641;
  *(_DWORD *)(a1 + 472) = -398984734;
  *(_DWORD *)(a1 + 476) = 1860138268;
  *(_DWORD *)(a1 + 480) = 1897591111;
  *(_DWORD *)(a1 + 484) = -1983567587;
  *(_DWORD *)(a1 + 488) = 241350511;
  *(_DWORD *)(a1 + 492) = 465442986;
  *(_DWORD *)(a1 + 496) = 1262376700;
  *(_DWORD *)(a1 + 500) = 544854726;
  *(_DWORD *)(a1 + 504) = -20915302;
  *(_DWORD *)(a1 + 508) = -195375752;
  *(_DWORD *)(a1 + 512) = 866704671;
  *(_DWORD *)(a1 + 516) = 835127176;
  *(_DWORD *)(a1 + 520) = 1494225585;
  *(_DWORD *)(a1 + 524) = 1609334823;
  *(_DWORD *)(a1 + 528) = -1451273888;
  *(_DWORD *)(a1 + 532) = 222999833;
  *(_DWORD *)(a1 + 536) = -1619335891;
  *(_DWORD *)(a1 + 540) = -274937453;
  *(_DWORD *)(a1 + 544) = 1295769760;
  *(_DWORD *)(a1 + 548) = -1326110034;
  *(_DWORD *)(a1 + 552) = 1018948552;
  *(_DWORD *)(a1 + 556) = 1637438339;
  *(_DWORD *)(a1 + 560) = 2114202391;
  *(_DWORD *)(a1 + 564) = 651589562;
  *(_DWORD *)(a1 + 568) = 1662282209;
  *(_DWORD *)(a1 + 572) = 2097946965;
  *(_DWORD *)(a1 + 576) = 67240333;
  *(_DWORD *)(a1 + 580) = 1075843080;
  *(_DWORD *)(a1 + 584) = 1815485312;
  *(_WORD *)(a1 + 588) = -21544;
  *(_QWORD *)(a1 + 56) = 0i64;
  if ( !a2 )
    goto LABEL_6;
  v8 = a2 - 1;
  if ( !v8 )
  {
    *(_DWORD *)(a1 + 32) = 6;
    *(_DWORD *)(a1 + 36) = 24;
    *(_DWORD *)(a1 + 40) = 12;
    *(_DWORD *)(a1 + 44) = 209;
    return a1;
  }
  if ( v8 != 1 )
  {
LABEL_6:
    *(_DWORD *)(a1 + 32) = 4;
    *(_DWORD *)(a1 + 36) = 16;
    *(_DWORD *)(a1 + 40) = 10;
    *(_DWORD *)(a1 + 44) = 176;
    return a1;
  }
  *(_DWORD *)(a1 + 32) = 8;
  *(_DWORD *)(a1 + 36) = 32;
  *(_DWORD *)(a1 + 40) = 14;
  *(_DWORD *)(a1 + 44) = 240;
  return a1;
}

__int64 __fastcall sub_180004080(__int64 a1, QByteArray *a2, QByteArray *a3, __int64 a4, QByteArray *a5)
{
  _DWORD *v8; // r14
  signed int v9; // esi
  const struct QByteArray *v10; // rbx
  int v11; // ecx
  int v13; // ecx
  int v14; // ecx
  int v15; // ecx
  const struct QByteArray *v16; // rdx
  unsigned int v17; // ecx
  int i; // ebx
  __int64 v19; // r9
  const struct QByteArray *v20; // rdx
  const char *v21; // rbx
  const char *v22; // rdi
  const struct QByteArray *v23; // r12
  signed __int64 v24; // rdi
  int v25; // r8d
  QByteArray *v26; // r13
  const char *v27; // rbx
  const char *v28; // r12
  int v29; // edi
  signed __int64 v30; // r12
  QByteArray *v31; // r14
  int v32; // r8d
  __int64 v33; // rdx
  unsigned int v34; // r8d
  __int64 v35; // r9
  __int64 v36; // rbx
  __int64 v37; // rax
  const struct QByteArray *v38; // rdx
  unsigned int v39; // ebx
  unsigned int v40; // ecx
  __int64 v41; // r9
  const struct QByteArray *v42; // rdx
  QByteArray *v43; // r13
  const char *v44; // rdi
  const char *v45; // r12
  int v46; // ebx
  signed __int64 v47; // r12
  int v48; // r8d
  unsigned int v49; // ebx
  __int64 v50; // rax
  unsigned int v51; // ecx
  __int64 v52; // r9
  const struct QByteArray *v53; // rdx
  int v54; // ebx
  int v55; // ebx
  int j; // ebx
  int v57; // edi
  __int64 v58; // rax
  int v59; // ebx
  __int64 v60; // rax
  char v61; // al
  unsigned int v62; // [rsp+28h] [rbp-51h]
  int v63; // [rsp+28h] [rbp-51h]
  int v64; // [rsp+28h] [rbp-51h]
  __int64 v65; // [rsp+30h] [rbp-49h] BYREF
  __int64 v66; // [rsp+38h] [rbp-41h] BYREF
  QByteArray *v67; // [rsp+40h] [rbp-39h] BYREF
  char v68[8]; // [rsp+48h] [rbp-31h] BYREF
  const struct QByteArray *v69; // [rsp+50h] [rbp-29h] BYREF
  char v70[8]; // [rsp+58h] [rbp-21h] BYREF
  char v71[8]; // [rsp+60h] [rbp-19h] BYREF
  char v72[16]; // [rsp+68h] [rbp-11h] BYREF
  char v73[16]; // [rsp+78h] [rbp-1h] BYREF
  __int64 v74; // [rsp+88h] [rbp+Fh]
  _DWORD *v75; // [rsp+D8h] [rbp+5Fh] BYREF
  QByteArray *v76; // [rsp+E0h] [rbp+67h]

  v76 = a2;
  v75 = (_DWORD *)a1;
  v74 = -2i64;
  v8 = (_DWORD *)a1;
  v9 = 0;
  v62 = 0;
  v10 = a5;
  if ( (*(int *)(a1 + 28) < 1
     || !QByteArray::isNull(a5)
     && (v11 = v8[5], *(_DWORD *)(*(_QWORD *)v10 + 4i64) == v11)
     && *(_DWORD *)(*(_QWORD *)a3 + 4i64) % v11 <= 0)
    && (v8[7] || *(_DWORD *)(*(_QWORD *)a3 + 4i64) % v8[5] <= 0) )
  {
    QByteArray::QByteArray((QByteArray *)&v65);
    sub_180004E80(v8, v68, a4);
    v13 = v8[7];
    if ( v13 )
    {
      v14 = v13 - 1;
      if ( v14 )
      {
        v15 = v14 - 1;
        if ( v15 )
        {
          if ( v15 == 1 )
          {
            QByteArray::QByteArray((QByteArray *)&v75);
            v16 = (const struct QByteArray *)sub_180003D30(v8, &v67, v68, v10);
            QByteArray::append((QByteArray *)&v75, v16);
            QByteArray::~QByteArray((QByteArray *)&v67);
            v17 = v8[5];
            for ( i = v17; i < *(_DWORD *)(*(_QWORD *)a3 + 4i64); i += v17 )
            {
              v19 = QByteArray::right(&v75, &v66, v17);
              v20 = (const struct QByteArray *)sub_180003D30(v8, &v67, v68, v19);
              QByteArray::append((QByteArray *)&v75, v20);
              QByteArray::~QByteArray((QByteArray *)&v67);
              QByteArray::~QByteArray((QByteArray *)&v66);
              v17 = v8[5];
            }
            v21 = QByteArray::begin(a3);
            v22 = QByteArray::begin((QByteArray *)&v75);
            v23 = QByteArray::QByteArray((QByteArray *)&v66);
            v24 = v22 - v21;
            while ( 1 )
            {
              v25 = v75[1];
              if ( v25 >= *(_DWORD *)(*(_QWORD *)a3 + 4i64) )
                v25 = *(_DWORD *)(*(_QWORD *)a3 + 4i64);
              if ( v9 >= v25 )
                break;
              QByteArray::insert((QByteArray *)&v66, v9++, *v21 ^ v21[v24]);
              ++v21;
            }
            QByteArray::append((QByteArray *)&v65, v23);
            QByteArray::~QByteArray((QByteArray *)&v66);
            QByteArray::~QByteArray((QByteArray *)&v75);
          }
        }
        else
        {
          v26 = (QByteArray *)sub_180003D30(v8, v71, v68, v10);
          v67 = (QByteArray *)QByteArray::mid(a3, v70, 0i64, (unsigned int)v8[5]);
          v27 = QByteArray::begin(v67);
          v28 = QByteArray::begin(v26);
          v69 = QByteArray::QByteArray((QByteArray *)&v66);
          v63 = 4;
          v29 = 0;
          v30 = v28 - v27;
          v31 = v67;
          while ( 1 )
          {
            v32 = *(_DWORD *)(*(_QWORD *)v26 + 4i64);
            if ( v32 >= *(_DWORD *)(*(_QWORD *)v31 + 4i64) )
              v32 = *(_DWORD *)(*(_QWORD *)v31 + 4i64);
            if ( v29 >= v32 )
              break;
            QByteArray::insert((QByteArray *)&v66, v29++, *v27 ^ v27[v30]);
            ++v27;
          }
          QByteArray::append((QByteArray *)&v65, v69);
          QByteArray::~QByteArray((QByteArray *)&v66);
          QByteArray::~QByteArray((QByteArray *)v70);
          QByteArray::~QByteArray((QByteArray *)v71);
          v33 = *(_QWORD *)a3;
          v8 = v75;
          if ( *(int *)(*(_QWORD *)a3 + 4i64) > 0 )
          {
            v34 = v75[5];
            do
            {
              if ( (signed int)(v34 + v9) < *(_DWORD *)(v33 + 4) )
              {
                v35 = QByteArray::mid(a3, &v69, (unsigned int)v9, v34);
                v36 = sub_180003D30(v8, v70, v68, v35);
                v37 = QByteArray::mid(a3, v71, (unsigned int)(v8[5] + v9), (unsigned int)v8[5]);
                v38 = (const struct QByteArray *)sub_180003C80(v8, &v75, v37, v36, v63);
                QByteArray::append((QByteArray *)&v65, v38);
                QByteArray::~QByteArray((QByteArray *)&v75);
                QByteArray::~QByteArray((QByteArray *)v71);
                QByteArray::~QByteArray((QByteArray *)v70);
                QByteArray::~QByteArray((QByteArray *)&v69);
                v34 = v8[5];
                v33 = *(_QWORD *)a3;
              }
              v9 += v34;
            }
            while ( v9 < *(_DWORD *)(v33 + 4) );
          }
        }
      }
      else
      {
        QByteArray::QByteArray((QByteArray *)&v66, v10);
        v39 = 0;
        LODWORD(v75) = 0;
        if ( *(int *)(*(_QWORD *)a3 + 4i64) > 0 )
        {
          v40 = v8[5];
          do
          {
            v41 = QByteArray::mid(a3, v70, v39, v40);
            v42 = (const struct QByteArray *)sub_180005090(v8, v71, v68, v41);
            QByteArray::append((QByteArray *)&v65, v42);
            QByteArray::~QByteArray((QByteArray *)v71);
            QByteArray::~QByteArray((QByteArray *)v70);
            v43 = (QByteArray *)QByteArray::mid(&v65, v73, v39, (unsigned int)v8[5]);
            v44 = QByteArray::begin(v43);
            v45 = QByteArray::begin((QByteArray *)&v66);
            v69 = QByteArray::QByteArray((QByteArray *)&v67);
            v64 = v62 | 2;
            v46 = 0;
            v47 = v45 - v44;
            while ( 1 )
            {
              v48 = *(_DWORD *)(v66 + 4);
              if ( v48 >= *(_DWORD *)(*(_QWORD *)v43 + 4i64) )
                v48 = *(_DWORD *)(*(_QWORD *)v43 + 4i64);
              if ( v46 >= v48 )
                break;
              QByteArray::insert((QByteArray *)&v67, v46++, *v44 ^ v44[v47]);
              ++v44;
            }
            v49 = (unsigned int)v75;
            QByteArray::replace((QByteArray *)&v65, (_DWORD)v75, v8[5], v69);
            v62 = v64 & 0xFFFFFFFD;
            QByteArray::~QByteArray((QByteArray *)&v67);
            QByteArray::~QByteArray((QByteArray *)v73);
            v50 = QByteArray::mid(a3, v72, v49, (unsigned int)v8[5]);
            QByteArray::operator=(&v66, v50);
            QByteArray::~QByteArray((QByteArray *)v72);
            v40 = v8[5];
            v39 = v40 + v49;
            LODWORD(v75) = v39;
          }
          while ( (signed int)v39 < *(_DWORD *)(*(_QWORD *)a3 + 4i64) );
        }
        QByteArray::~QByteArray((QByteArray *)&v66);
      }
    }
    else if ( *(int *)(*(_QWORD *)a3 + 4i64) > 0 )
    {
      v51 = v8[5];
      do
      {
        v52 = QByteArray::mid(a3, v72, (unsigned int)v9, v51);
        v53 = (const struct QByteArray *)sub_180005090(v8, &v75, v68, v52);
        QByteArray::append((QByteArray *)&v65, v53);
        QByteArray::~QByteArray((QByteArray *)&v75);
        QByteArray::~QByteArray((QByteArray *)v72);
        v51 = v8[5];
        v9 += v51;
      }
      while ( v9 < *(_DWORD *)(*(_QWORD *)a3 + 4i64) );
    }
    v54 = v8[12];
    if ( *(_DWORD *)(v65 + 4) )
    {
      QByteArray::QByteArray((QByteArray *)&v75, (const struct QByteArray *)&v65);
      if ( v54 )
      {
        v55 = v54 - 1;
        if ( v55 )
        {
          if ( v55 == 1 )
          {
            for ( j = v75[1] - 1; j >= 0; --j )
            {
              if ( QByteArray::at((QByteArray *)&v75, j) )
                break;
            }
            if ( QByteArray::at((QByteArray *)&v75, j) == (char)0x80 )
              QByteArray::truncate((QByteArray *)&v75, j);
          }
        }
        else
        {
          v57 = v75[1];
          v58 = QByteArray::back(&v75, v72);
          v59 = (char)QByteRef::operator char(v58);
          v60 = QByteArray::back(&v75, v73);
          v61 = QByteRef::operator char(v60);
          QByteArray::remove((QByteArray *)&v75, v57 - v61, v59);
        }
      }
      else
      {
        while ( !QByteArray::at((QByteArray *)&v75, v75[1] - 1) )
          QByteArray::remove((QByteArray *)&v75, v75[1] - 1, 1);
      }
      QByteArray::QByteArray(&v67, &v75);
      QByteArray::~QByteArray((QByteArray *)&v75);
    }
    else
    {
      QByteArray::QByteArray((QByteArray *)&v67, (const struct QByteArray *)&v65);
    }
    QByteArray::~QByteArray((QByteArray *)&v67);
    QByteArray::QByteArray(v76, &v65);
    QByteArray::~QByteArray((QByteArray *)v68);
    QByteArray::~QByteArray((QByteArray *)&v65);
    return (__int64)v76;
  }
  else
  {
    QByteArray::QByteArray(a2);
    return (__int64)a2;
  }
}

QByteArray *__fastcall sub_180005720(__int64 a1, QByteArray *a2, const struct QByteArray *a3)
{
  int v4; // ebx
  int v6; // ebx
  int i; // ebx
  int v8; // edi
  __int64 v9; // rax
  int v10; // ebx
  __int64 v11; // rax
  char v12; // al
  char v13[16]; // [rsp+28h] [rbp-30h] BYREF
  char v14[32]; // [rsp+38h] [rbp-20h] BYREF
  QByteArray *v15; // [rsp+68h] [rbp+10h] BYREF

  v15 = a2;
  v4 = *(_DWORD *)(a1 + 48);
  if ( *(_DWORD *)(*(_QWORD *)a3 + 4i64) )
  {
    QByteArray::QByteArray((QByteArray *)&v15, a3);
    if ( v4 )
    {
      v6 = v4 - 1;
      if ( v6 )
      {
        if ( v6 == 1 )
        {
          for ( i = *((_DWORD *)v15 + 1) - 1; i >= 0; --i )
          {
            if ( QByteArray::at((QByteArray *)&v15, i) )
              break;
          }
          if ( QByteArray::at((QByteArray *)&v15, i) == (char)0x80 )
            QByteArray::truncate((QByteArray *)&v15, i);
        }
      }
      else
      {
        v8 = *((_DWORD *)v15 + 1);
        v9 = QByteArray::back(&v15, v13);
        v10 = (char)QByteRef::operator char(v9);
        v11 = QByteArray::back(&v15, v14);
        v12 = QByteRef::operator char(v11);
        QByteArray::remove((QByteArray *)&v15, v8 - v12, v10);
      }
    }
    else
    {
      while ( !QByteArray::at((QByteArray *)&v15, *((_DWORD *)v15 + 1) - 1) )
        QByteArray::remove((QByteArray *)&v15, *((_DWORD *)v15 + 1) - 1, 1);
    }
    QByteArray::QByteArray(a2, &v15);
    QByteArray::~QByteArray((QByteArray *)&v15);
    return a2;
  }
  else
  {
    QByteArray::QByteArray(a2, a3);
    return a2;
  }
}
```

直接询问AI：

> 在DecodeAes函数中，我们注意到调用sub_180004080时，传递的第三个参数是v7，即从Base64解码的QByteArray，这应该是密文。第四个参数是a3（即v12，是a3字符串的UTF-8表示），第五个参数是v6（即v10，也是a3字符串的UTF-8表示）。所以，这里a3字符串被重复使用了。实际上，在解密过程中，a3字符串可能作为密钥（key）和初始化向量（IV）？这不太符合常规。

我们不等输出了，直接去cyberchef测试：

[recipe](https://lab.tonycrane.cc/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)AES_Decrypt(%7B'option':'Latin1','string':'o%2Bqx6DjrrHcTGz1p'%7D,%7B'option':'Latin1','string':'o%2Bqx6DjrrHcTGz1p'%7D,'CBC','Raw','Raw',%7B'option':'Hex','string':''%7D,%7B'option':'Hex','string':''%7D)&input=Qkt6NElaT3ZreXp3WUFYS0RQaTJCS0VRcVRMRjI5UXlMc1d0NTJadCtpSXgyQ3Myazl3Ym11NW9XSE9rWUw3TmI0NVFYUGRJUzdMWHQ5cmhFQlI3UVF3aGhsck1FNDYzVVBLcnNLL0UyMG4vVm9uaTlJQm1aTEd4SzltQldySVZnZTd2MDZSSDVkT2cxVk9CUi9sSWIwZnM5SjkwRWx5MDBBeGFGVGo4cGcyUUs5Zm9zUVA5Q0lUYXY3cEZhSHJpSHhNNkZmcXVNdE5JeUhzK1l2N3NSM1ZZaEVNQWdxbTdoZ3E2WTJnWW5mMWdySGUyVkl3YjJxZUxCNlJLbkhmRDVITzE5ZlJKbVdwcld5M3BUUUUvR1JCSHlJcUpDbXR1dktOenN2SjRGbXFFTlRPcVVpR3hEWnpLVjlFMDlGU1d2ZURFQkRBazY3Q1Jza29oMnlnaEVMNDVzY1NvalZyQlRaWnZydlQrcEhPY0pVMkRHOTVtTGlWcHV3ZHRPTGxldUJVU1F6dWFiZ0lod2lkcVhQbzByNkRhTUpHSTRvdS83MExYeThwbXZJMVNtSFQxa2FOZ05UMEZGaWtERzl1QmFWQUl4T0VYVDhwdzVpVjFQRGhEbkNOa0p5OUdodm1KYUh4RkN1cFRrRHlSOW1heVRTRGNvbzBvRGo3U2lkWTFJVTNWc29NektFRndiSkIzYW1GemljTGw5bGRTQXFKUGY0d2FmMGxCVnN1Y0pHVDZCVmw0NGVnYXp4bFNwQTZ5R3I2Z0xJNUx4MU5mYmFidlJlMjhHZHNrTlg1UUd4a2toSWJBZzhTbjJQbz0&ieol=CRLF&oeol=FF)

发现解密大成功。

# 稍微优化一下进下一步

在先前的步骤中，我们得知了对于任意API request，我们都可以通过Base64解码后AES解密得到原始数据，AES的key和IV均为字符串"a+qx6DjrrHcTGz1p"的UTF-8表示。

那么我们写一个node.js脚本来自动化这个过程：他会读取URL，然后进行解密，最后输出结果。

```javascript
const crypto = require('crypto');
// use native fetch

async function fetchAndDecrypt(url) {
    const response = await fetch(url).then(res => res.json());

    if(!response || !response.data || !response.data.cipher_text) {
        console.error("No data field in response:", response);
        return;
    }
    const base64Data = response.data.cipher_text;

    // Base64 decode
    const encryptedData = Buffer.from(base64Data, 'base64');

    // AES decrypt
    const keyIv = Buffer.from('a+qx6DjrrHcTGz1p', 'utf-8');
    const decipher = crypto.createDecipheriv('aes-128-cbc', keyIv, keyIv);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    console.log(decrypted.toString('utf-8'));
}
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Enter URL: ", function(url) {
    fetchAndDecrypt(url).then(() => rl.close());
});
```


# 接下来是web的部分

要研究清楚这些API request的作用和参数。

咋搞呢？懒得一个一个试了，目前想到的方法是把几个核心函数喂给AI让它整理。整理结果如下：

1.  URL: `https://api-takumi-static.■■■■■■.com/cls/backyard/api/getFSM`

    参数: 

    - app_id: `5f17af398d20e6ddc9767e5a`
    - version: `2.2.1.3`
    - is_preview: `false`

2.  URL: `https://api-takumi-static.■■■■■■.com/cls/backyard/api/listWebConf`

    参数: 

    - app_id: `5f17af398d20e6ddc9767e5a`
    - is_preview: `false`

3.  URL: `https://api-takumi-static.■■■■■■.com/cls/backyard/api/listStyle`

    参数: 

    - app_id: `5f17af398d20e6ddc9767e5a`
    - version: `2.2.1.3`
    - is_preview: `false`

4.  URL: `https://api-takumi-static.■■■■■■.com/cls/backyard/api/listVideoGroups`

    参数: 

    - app_id: `5f17af398d20e6ddc9767e5a`
    - group_video_version: `0`

5. URL: `https://api-takumi-static.■■■■■■.com/cls/backyard/api/listGroupVideos`

   参数: 

   - app_id: `5f17af398d20e6ddc9767e5a`
   - key: string，来自传入的QString参数
   - group_video_version: integer，默认为`0`
   - format: integer，来自传入的QString参数的第二个字段
   - current_page: integer，来自传入的QString参数的第六个字段
   - page_size: integer，来自传入的QString参数的第七个字段
   - is_preview: `false`
   - tag: string，可选，来自传入的QString参数的偏移字段

6. URL: `https://api-takumi-static.■■■■■■.com/cls/backyard/api/getVideoGroupStats`

   参数: 

   - app_id: `5f17af398d20e6ddc9767e5a`
   - key: string，来自传入的QString参数（a3）
   - group_video_version: integer，默认为`0`
   - is_preview: `false`

别的没试


先`listVideoGroups`：

```json
{
    "list": [
        {
            "key": "defaultGroup",
            "lang_name": [
                {
                    "lang": "ZH-CN",
                    "name": "yoyo鹿鸣"
                },
                {
                    "lang": "EN-US",
                    "name": "Lumi"
                }
            ],
            "is_shown_default": true,
            "background": ""
        },
        {
            "key": "lumi",
            "lang_name": [
                {
                    "lang": "ZH-CN",
                    "name": "鹿鸣练习室"
                },
                {
                    "lang": "EN-US",
                    "name": "Practice Room"
                }
            ],
            "is_shown_default": true,
            "background": ""
        },
        {
            "key": "game",
            "lang_name": [
                {
                    "lang": "ZH-CN",
                    "name": "精选壁纸"
                },
                {
                    "lang": "EN-US",
                    "name": "Featured"
                }
            ],
            "is_shown_default": true,
            "background": ""
        }
    ]
}
```

用key=game传getVideoGroupStats

```json
{
    "format_stats": [
        {
            "format": "Dynamic",
            "filter_tags": [
                {
                    "id": "8",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "崩坏星穹铁道"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Honkai: Star Rail"
                        }
                    ]
                },
                {
                    "id": "5",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "原神"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Genshin Impact"
                        }
                    ]
                },
                {
                    "id": "4",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "崩坏3"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Honkai Impact 3"
                        }
                    ]
                },
                {
                    "id": "1",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "未定事件簿"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Tears of Themis"
                        }
                    ]
                },
                {
                    "id": "2",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "崩坏学园2"
                        },
                        {
                            "lang": "EN-US",
                            "name": " Houkai Gakuen2"
                        }
                    ]
                },
                {
                    "id": "7",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "HOYO-MiX"
                        },
                        {
                            "lang": "EN-US",
                            "name": "HOYO-MiX"
                        }
                    ]
                },
                {
                    "id": "3",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "yoyo鹿鸣"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Lumi"
                        }
                    ]
                },
                {
                    "id": "9",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "绝区零"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Zenless Zone Zero"
                        }
                    ]
                },
                {
                    "id": "10",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "预研"
                        },
                        {
                            "lang": "EN-US",
                            "name": "pre-research"
                        }
                    ]
                }
            ],
            "count": 288
        },
        {
            "format": "Static",
            "filter_tags": [
                {
                    "id": "8",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "崩坏星穹铁道"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Honkai: Star Rail"
                        }
                    ]
                },
                {
                    "id": "5",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "原神"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Genshin Impact"
                        }
                    ]
                },
                {
                    "id": "4",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "崩坏3"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Honkai Impact 3"
                        }
                    ]
                },
                {
                    "id": "2",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "崩坏学园2"
                        },
                        {
                            "lang": "EN-US",
                            "name": " Houkai Gakuen2"
                        }
                    ]
                },
                {
                    "id": "1",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "未定事件簿"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Tears of Themis"
                        }
                    ]
                },
                {
                    "id": "3",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "yoyo鹿鸣"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Lumi"
                        }
                    ]
                },
                {
                    "id": "9",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "绝区零"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Zenless Zone Zero"
                        }
                    ]
                }
            ],
            "count": 726
        },
        {
            "format": "AllVideoFormat",
            "filter_tags": [
                {
                    "id": "2",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "崩坏学园2"
                        },
                        {
                            "lang": "EN-US",
                            "name": " Houkai Gakuen2"
                        }
                    ]
                },
                {
                    "id": "5",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "原神"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Genshin Impact"
                        }
                    ]
                },
                {
                    "id": "1",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "未定事件簿"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Tears of Themis"
                        }
                    ]
                },
                {
                    "id": "4",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "崩坏3"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Honkai Impact 3"
                        }
                    ]
                },
                {
                    "id": "7",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "HOYO-MiX"
                        },
                        {
                            "lang": "EN-US",
                            "name": "HOYO-MiX"
                        }
                    ]
                },
                {
                    "id": "3",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "yoyo鹿鸣"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Lumi"
                        }
                    ]
                },
                {
                    "id": "8",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "崩坏星穹铁道"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Honkai: Star Rail"
                        }
                    ]
                },
                {
                    "id": "9",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "绝区零"
                        },
                        {
                            "lang": "EN-US",
                            "name": "Zenless Zone Zero"
                        }
                    ]
                },
                {
                    "id": "10",
                    "lang_name": [
                        {
                            "lang": "ZH-CN",
                            "name": "预研"
                        },
                        {
                            "lang": "EN-US",
                            "name": "pre-research"
                        }
                    ]
                }
            ],
            "count": 1014
        }
    ]
}
```


然后listGroupVideos：结果略，btw，`page_size`最大500。


问题来了，我们看到输出的JSON里全是电脑端壁纸，那么手机端壁纸哪去了？

试了一下group_video_version，发现只有0和1有数据，但都不是手机端壁纸。

好吧我们猜测手机端应该和电脑端不是一个API接口，手机端的等有空了再逆向。

# 将ndf转为png或mp4

这个网上教程多了是了，不再赘述。