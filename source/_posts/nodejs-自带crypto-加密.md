---
title: nodejs 自带crypto 加密
date: 2024-12-13 15:29:38
tags:
  - nodejs
categories: 
  - nodejs crypto 
---


nodejs 自带crypto 加密


```


import crypto from 'node:crypto';


// nodejs 自带rsa加解密
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {modulusLength: 1024});
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from('xU7mp91!'))

const rsa_pass = encrypted.toString('hex');
console.log(rsa_pass);


const rsa_depass = crypto.privateDecrypt(privateKey, encrypted)

console.log(rsa_depass.toString());

//哈希函数
//不能被解密 单项 不可逆的

let hash = crypto.createHash('sha256');

hash.update('hello');

console.log('sha256===>',hash.digest('hex'));

//md5 包裹一下存储到数据库中， i每次加密后值不变
let hash1 = crypto.createHash('md5');

hash1.update('hello');

console.log('md5===>',hash1.digest('hex'));


//对称加密算法
//第一个参数： aes-128-cbc 算法
//第二个参数： key 加密的密钥 32位
//第三个参数： iv 初始化向量 16位 保证我们生成的密钥是随机的,密钥串缺少位数，还可以进行补码操作

let key = crypto.randomBytes(32);
let iv = Buffer.from(crypto.randomBytes(16));
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

cipher.update('123456','utf-8', 'hex')

const result = cipher.final('hex') //输出16进制

console.log("对称加密算法：",result)

//解密 相同的算法 相同的key相同的iv
const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
decipher.update(result,'hex','utf-8')
console.log(decipher.final('utf-8'))

```

加密：
https://www.douyin.com/user/self?from_tab_name=main&modal_id=7310094866795613491&showTab=record

