package com.ruoyi.screen.service.impl;

import java.util.List;

import com.ruoyi.common.annotation.DataScope;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.screen.domain.SysScreen;
import com.ruoyi.screen.mapper.SysScreenMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ruoyi.screen.service.IScreenService;

@Service
public class ScreenServiceImpl implements IScreenService {
    @Autowired
    private SysScreenMapper sysScreenMapper;

    /**
     * 大屏列表
     * 
     * @param sysScreen
     * @return
     */
    @Override
    @DataScope(deptAlias = "d", userAlias = "u")
    public List<SysScreen> selectScreenList(SysScreen sysScreen) {
        return sysScreenMapper.selectScreenList(sysScreen);
    }

    /**
     * 新增大屏
     * 
     * @param sysScreen
     * @return
     */
    @Override
    public Long insertScreen(SysScreen sysScreen) {
        sysScreen.setCreateTime(DateUtils.getNowDate());
        sysScreen.setCreateBy("" + SecurityUtils.getUserId());
        sysScreenMapper.insertScreen(sysScreen);

        return sysScreen.getScreenId();
    }

    /**
     * 批量删除大屏
     * 
     * @param screenIds 需要删除的大屏任务主键
     * @return 结果
     */
    @Override
    public int deleteScreenByScreenIds(Long[] screenIds) {
        return sysScreenMapper.deleteScreenByScreenIds(screenIds, SecurityUtils.getUserId());
    }

    /**
     * 查询大屏详情
     * 
     * @param screenId
     * @return
     */
    @Override
    public SysScreen selectScreenByScreenId(Long screenId) {
        return sysScreenMapper.selectScreenByScreenId(screenId);
    }

    /**
     * 修改大屏
     * 
     * @param sysScreen
     * @return
     */
    @Override
    public int updateScreen(SysScreen sysScreen) {
        sysScreen.setUpdateTime(DateUtils.getNowDate());
        sysScreen.setUpdateBy("" + SecurityUtils.getUserId());
        return sysScreenMapper.updateScreen(sysScreen);
    }
}
